<?php

declare(strict_types=1);

namespace App\Core;

class Request
{
    private array $data;
    private ?array $auth = null;
    
    public function __construct()
    {
        $this->data = $this->parseRequestData();
    }
    
    public function setAuth(array $auth): void
    {
        $this->auth = $auth;
    }
    
    public function getAuth(): ?array
    {
        return $this->auth;
    }
    
    public function getUserId(): ?int
    {
        return $this->auth['user_id'] ?? null;
    }
    
    public function getCompanyId(): ?int
    {
        if (!$this->auth) {
            return null;
        }
        
        $companyId = $this->auth['company_id'] ?? null;
        return $companyId ? (int)$companyId : null;
    }
    
    public function getUserRole(): ?string
    {
        return $this->auth['role'] ?? null;
    }
    
    public function getMethod(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    public function getPath(): string
    {
        $path = $_SERVER['REQUEST_URI'] ?? '/';
        $position = strpos($path, '?');
        
        if ($position !== false) {
            $path = substr($path, 0, $position);
        }
        
        return $path;
    }
    
    public function getQueryParams(): array
    {
        return $_GET;
    }
    
    public function getBody(): array
    {
        return $this->data;
    }
    
    public function get(string $key, $default = null)
    {
        return $this->data[$key] ?? $default;
    }
    
    public function has(string $key): bool
    {
        return isset($this->data[$key]);
    }
    
    public function getHeader(string $header): ?string
    {
        $header = 'HTTP_' . strtoupper(str_replace('-', '_', $header));
        return $_SERVER[$header] ?? null;
    }
    
    private function parseRequestData(): array
    {
        if ($this->getMethod() === 'GET') {
            return $_GET;
        }
        
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        return $data ?? $_POST;
    }
}

