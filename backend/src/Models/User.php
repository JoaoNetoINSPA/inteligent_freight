<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Model;

class User extends Model
{
    protected string $table = 'users';
    
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $result = $stmt->fetch();
        
        return $result ?: null;
    }
    
    public function findByCompany(int $companyId): array
    {
        return $this->where('company_id', $companyId);
    }
}

