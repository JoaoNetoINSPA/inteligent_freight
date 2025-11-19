<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\User;

class UserController extends Controller
{
    private User $userModel;
    
    public function __construct(?Request $request = null)
    {
        parent::__construct($request);
        $this->userModel = new User();
    }
    
    public function index(): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $users = $this->userModel->findByCompany($companyId);
        
        foreach ($users as &$user) {
            unset($user['password']);
        }
        
        Response::success($users);
    }
    
    public function store(): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $errors = $this->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
            'role' => 'required'
        ]);
        
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }
        
        $data = $this->request->getBody();
        
        if ($this->userModel->findByEmail($data['email'])) {
            Response::error('Email already exists', 409);
        }
        
        $data['company_id'] = $companyId;
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $userId = $this->userModel->create($data);
        
        Response::success(
            ['user_id' => $userId],
            'User created successfully',
            201
        );
    }
    
    public function show(string $id): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $user = $this->userModel->find((int)$id);
        
        if (!$user) {
            Response::error('User not found', 404);
        }
        
        if ($user['company_id'] != $companyId) {
            Response::error('User not found', 404);
        }
        
        unset($user['password']);
        
        Response::success($user);
    }
    
    public function destroy(string $id): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $user = $this->userModel->find((int)$id);
        
        if (!$user) {
            Response::error('User not found', 404);
        }
        
        if ($user['company_id'] != $companyId) {
            Response::error('User not found', 404);
        }
        
        $this->userModel->delete((int)$id);
        
        Response::success([], 'User deleted successfully');
    }
}

