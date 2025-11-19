<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Model;

class Package extends Model
{
    protected string $table = 'packages';
    
    public function findByCompany(int $companyId): array
    {
        return $this->where('company_id', $companyId);
    }
}

