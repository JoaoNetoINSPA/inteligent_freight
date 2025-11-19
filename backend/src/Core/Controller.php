<?php

declare(strict_types=1);

namespace App\Core;

abstract class Controller
{
    protected Request $request;
    
    public function __construct(?Request $request = null)
    {
        $this->request = $request ?? new Request();
    }
    
    protected function validate(array $rules): array
    {
        $errors = [];
        $data = $this->request->getBody();
        
        foreach ($rules as $field => $rule) {
            $value = $data[$field] ?? null;
            
            if (str_contains($rule, 'required') && empty($value)) {
                $errors[$field] = ucfirst($field) . ' is required';
            }
            
            if (str_contains($rule, 'email') && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $errors[$field] = ucfirst($field) . ' must be a valid email';
            }
            
            if (preg_match('/min:(\d+)/', $rule, $matches)) {
                $min = (int)$matches[1];
                if (strlen((string)$value) < $min) {
                    $errors[$field] = ucfirst($field) . " must be at least {$min} characters";
                }
            }
        }
        
        return $errors;
    }
}

