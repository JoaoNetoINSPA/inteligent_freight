<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/bootstrap.php';

use App\Core\Router;
use App\Core\Request;

$router = new Router();

require_once __DIR__ . '/../src/routes.php';

$request = new Request();
$router->dispatch($request);

