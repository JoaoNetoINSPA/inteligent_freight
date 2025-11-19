<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Core\Database;
use App\Core\JWT;
use App\Models\Company;
use App\Models\User;

class AuthController extends Controller
{
    private Company $companyModel;
    private User $userModel;
    
    public function __construct(?Request $request = null)
    {
        parent::__construct($request);
        $this->companyModel = new Company();
        $this->userModel = new User();
    }
    
    public function health(): void
    {
        Response::success(['status' => 'API is running']);
    }
    
    public function register(): void
    {
        $errors = $this->validate([
            'company_name' => 'required',
            'company_address' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);
        
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }
        
        $data = $this->request->getBody();
        
        if ($this->userModel->findByEmail($data['email'])) {
            Response::error('Email already exists', 409);
        }
        
        try {
            $db = Database::getInstance();
            $db->beginTransaction();
            
            $companyData = [
                'company_name' => $data['company_name'],
                'company_address' => $data['company_address']
            ];
            $companyId = $this->companyModel->create($companyData);
            
            $userData = [
                'company_id' => $companyId,
                'email' => $data['email'],
                'password' => password_hash($data['password'], PASSWORD_DEFAULT),
                'role' => 'admin'
            ];
            $userId = $this->userModel->create($userData);
            
            $db->commit();
            
            $token = JWT::generate([
                'user_id' => $userId,
                'company_id' => $companyId,
                'email' => $data['email'],
                'role' => 'admin'
            ]);
            
            Response::success(
                [
                    'company_id' => $companyId,
                    'user_id' => $userId,
                    'token' => $token
                ],
                'Company and user registered successfully',
                201
            );
        } catch (\Exception $e) {
            $db->rollBack();
            Response::error('Registration failed', 500);
        }
    }
    
    public function login(): void
    {
        $errors = $this->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }
        
        $data = $this->request->getBody();
        $user = $this->userModel->findByEmail($data['email']);
        
        if (!$user || !password_verify($data['password'], $user['password'])) {
            Response::error('Invalid credentials', 401);
        }
        
        $company = $this->companyModel->find($user['company_id']);
        
        unset($user['password']);
        
        $token = JWT::generate([
            'user_id' => $user['id'],
            'company_id' => $user['company_id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);
        
        Response::success([
            'user' => $user,
            'company' => $company,
            'token' => $token
        ], 'Login successful');
    }
}

