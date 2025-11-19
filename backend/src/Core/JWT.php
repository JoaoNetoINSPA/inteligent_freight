<?php

declare(strict_types=1);

namespace App\Core;

use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;
use Exception;

class JWT
{
    private static string $secretKey;
    private static string $algorithm = 'HS256';
    private static int $expirationTime = 86400;
    
    public static function init(): void
    {
        self::$secretKey = getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production';
    }
    
    public static function generate(array $payload): string
    {
        self::init();
        
        $issuedAt = time();
        $expiration = $issuedAt + self::$expirationTime;
        
        $token = [
            'iat' => $issuedAt,
            'exp' => $expiration,
            'data' => $payload
        ];
        
        return FirebaseJWT::encode($token, self::$secretKey, self::$algorithm);
    }
    
    public static function validate(string $token): ?array
    {
        self::init();
        
        try {
            $decoded = FirebaseJWT::decode($token, new Key(self::$secretKey, self::$algorithm));
            // Convert stdClass to array recursively
            $data = json_decode(json_encode($decoded->data), true);
            return is_array($data) ? $data : null;
        } catch (Exception $e) {
            return null;
        }
    }
    
    public static function getTokenFromHeader(): ?string
    {
        if (!function_exists('getallheaders')) {
            $headers = [];
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                }
            }
        } else {
            $headers = getallheaders();
        }
        
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if (!$authHeader) {
            return null;
        }
        
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
}

