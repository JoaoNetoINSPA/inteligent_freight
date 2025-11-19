<?php

declare(strict_types=1);

return [
    'host' => getenv('DB_HOST') ?: 'mysql',
    'port' => getenv('DB_PORT') ?: '3306',
    'database' => getenv('DB_NAME') ?: 'intelligent_freight',
    'username' => getenv('DB_USER') ?: 'freight_user',
    'password' => getenv('DB_PASS') ?: 'freight_password',
    'charset' => 'utf8mb4'
];

