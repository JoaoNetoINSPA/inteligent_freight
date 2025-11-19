<?php

declare(strict_types=1);

namespace App\Core;

use PDO;

abstract class Model
{
    protected PDO $db;
    protected string $table;
    
    public function __construct()
    {
        $this->db = Database::getInstance();
    }
    
    public function all(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll();
    }
    
    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        
        return $result ?: null;
    }
    
    public function create(array $data): int
    {
        $fields = array_keys($data);
        $values = ':' . implode(', :', $fields);
        $fields = implode(', ', $fields);
        
        $sql = "INSERT INTO {$this->table} ({$fields}) VALUES ({$values})";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($data);
        
        return (int)$this->db->lastInsertId();
    }
    
    public function update(int $id, array $data): bool
    {
        $fields = [];
        foreach (array_keys($data) as $field) {
            $fields[] = "{$field} = :{$field}";
        }
        $fields = implode(', ', $fields);
        
        $sql = "UPDATE {$this->table} SET {$fields} WHERE id = :id";
        $data['id'] = $id;
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($data);
    }
    
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
    
    public function where(string $column, $value): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE {$column} = :value");
        $stmt->execute(['value' => $value]);
        return $stmt->fetchAll();
    }
}

