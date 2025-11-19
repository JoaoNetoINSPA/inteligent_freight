<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\Package;

class PackageController extends Controller
{
    private Package $packageModel;
    
    public function __construct(?Request $request = null)
    {
        parent::__construct($request);
        $this->packageModel = new Package();
    }
    
    public function index(): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $packages = $this->packageModel->findByCompany($companyId);
        
        Response::success($packages);
    }
    
    public function store(): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $data = $this->request->getBody();
        
        $errors = $this->validate([
            'order_id' => 'required',
        ]);
        
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }
        
        $data['company_id'] = $companyId;
        $packageId = $this->packageModel->create($data);
        
        Response::success(
            ['package_id' => $packageId],
            'Package created successfully',
            201
        );
    }
    
    public function show(string $id): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $package = $this->packageModel->find((int)$id);
        
        if (!$package) {
            Response::error('Package not found', 404);
        }
        
        if ($package['company_id'] != $companyId) {
            Response::error('Package not found', 404);
        }
        
        Response::success($package);
    }
    
    public function update(string $id): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $package = $this->packageModel->find((int)$id);
        
        if (!$package) {
            Response::error('Package not found', 404);
        }
        
        if ($package['company_id'] != $companyId) {
            Response::error('Package not found', 404);
        }
        
        $data = $this->request->getBody();
        $this->packageModel->update((int)$id, $data);
        
        Response::success([], 'Package updated successfully');
    }
    
    public function destroy(string $id): void
    {
        $companyId = $this->request->getCompanyId();
        
        if (!$companyId) {
            Response::error('Company ID not found in token', 401);
        }
        
        $package = $this->packageModel->find((int)$id);
        
        if (!$package) {
            Response::error('Package not found', 404);
        }
        
        if ($package['company_id'] != $companyId) {
            Response::error('Package not found', 404);
        }
        
        $this->packageModel->delete((int)$id);
        
        Response::success([], 'Package deleted successfully');
    }
}

