<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\Company;

class CompanyController extends Controller
{
    private Company $companyModel;
    
    public function __construct(?Request $request = null)
    {
        parent::__construct($request);
        $this->companyModel = new Company();
    }
    
    public function index(): void
    {
        $companies = $this->companyModel->all();
        Response::success($companies);
    }
    
    public function show(string $id): void
    {
        $company = $this->companyModel->find((int)$id);
        
        if (!$company) {
            Response::error('Company not found', 404);
        }
        
        Response::success($company);
    }
}

