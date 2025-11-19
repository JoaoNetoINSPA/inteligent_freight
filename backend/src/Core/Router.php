<?php

declare(strict_types=1);

namespace App\Core;

class Router
{
    private array $routes = [];
    
    public function get(string $path, string $controller, string $method, ?string $middleware = null): void
    {
        $this->addRoute('GET', $path, $controller, $method, $middleware);
    }
    
    public function post(string $path, string $controller, string $method, ?string $middleware = null): void
    {
        $this->addRoute('POST', $path, $controller, $method, $middleware);
    }
    
    public function put(string $path, string $controller, string $method, ?string $middleware = null): void
    {
        $this->addRoute('PUT', $path, $controller, $method, $middleware);
    }
    
    public function delete(string $path, string $controller, string $method, ?string $middleware = null): void
    {
        $this->addRoute('DELETE', $path, $controller, $method, $middleware);
    }
    
    private function addRoute(string $httpMethod, string $path, string $controller, string $method, ?string $middleware = null): void
    {
        $this->routes[] = [
            'method' => $httpMethod,
            'path' => $path,
            'controller' => $controller,
            'action' => $method,
            'middleware' => $middleware
        ];
    }
    
    public function dispatch(Request $request): void
    {
        $requestMethod = $request->getMethod();
        $requestUri = $request->getPath();
        
        foreach ($this->routes as $route) {
            $pattern = preg_replace('/\{[a-zA-Z0-9_]+\}/', '([a-zA-Z0-9_-]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';
            
            if ($route['method'] === $requestMethod && preg_match($pattern, $requestUri, $matches)) {
                array_shift($matches);
                
                if ($route['middleware']) {
                    $middlewareClass = $route['middleware'];
                    if (class_exists($middlewareClass)) {
                        $middleware = new $middlewareClass();
                        $response = $middleware->handle($request);
                        if ($response !== null) {
                            return;
                        }
                    }
                }
                
                $controllerName = $route['controller'];
                $action = $route['action'];
                
                if (!class_exists($controllerName)) {
                    Response::json(['error' => 'Controller not found'], 404);
                    return;
                }
                
                // Pass the same Request instance to the controller
                $controller = new $controllerName($request);
                
                if (!method_exists($controller, $action)) {
                    Response::json(['error' => 'Method not found'], 404);
                    return;
                }
                
                call_user_func_array([$controller, $action], $matches);
                return;
            }
        }
        
        Response::json(['error' => 'Route not found'], 404);
    }
}

