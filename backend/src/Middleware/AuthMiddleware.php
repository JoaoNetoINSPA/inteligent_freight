<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\Middleware;
use App\Core\Request;
use App\Core\Response;
use App\Core\JWT;

class AuthMiddleware extends Middleware
{
    public function handle(Request $request): ?Response
    {
        $token = JWT::getTokenFromHeader();
        
        if (!$token) {
            Response::error('Authentication token required', 401);
            return null;
        }
        
        $payload = JWT::validate($token);

        if (!$payload) {
            Response::error('Invalid or expired token', 401);
            return null;
        }
        
        // Ensure payload is a proper array
        if (!is_array($payload)) {
            $payload = json_decode(json_encode($payload), true);
        }
        
        $request->setAuth($payload);
        
        return null;
    }
}

