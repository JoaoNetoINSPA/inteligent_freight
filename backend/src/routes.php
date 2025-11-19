<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\CompanyController;
use App\Controllers\PackageController;
use App\Controllers\UserController;
use App\Middleware\AuthMiddleware;

$router->get('/api/health', AuthController::class, 'health');

$router->post('/api/auth/register', AuthController::class, 'register');
$router->post('/api/auth/login', AuthController::class, 'login');

$router->get('/api/companies', CompanyController::class, 'index', AuthMiddleware::class);
$router->get('/api/companies/{id}', CompanyController::class, 'show', AuthMiddleware::class);

$router->get('/api/packages', PackageController::class, 'index', AuthMiddleware::class);
$router->post('/api/packages', PackageController::class, 'store', AuthMiddleware::class);
$router->get('/api/packages/{id}', PackageController::class, 'show', AuthMiddleware::class);
$router->put('/api/packages/{id}', PackageController::class, 'update', AuthMiddleware::class);
$router->delete('/api/packages/{id}', PackageController::class, 'destroy', AuthMiddleware::class);

$router->get('/api/users', UserController::class, 'index', AuthMiddleware::class);
$router->post('/api/users', UserController::class, 'store', AuthMiddleware::class);
$router->get('/api/users/{id}', UserController::class, 'show', AuthMiddleware::class);
$router->delete('/api/users/{id}', UserController::class, 'destroy', AuthMiddleware::class);

