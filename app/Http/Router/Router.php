<?php

namespace App\Http\Router;

use App\Http\Router\RouteDefinition;
use App\Http\Request;

class Router
{
    protected static ?self $instance = null;
    protected array $routes = [];

    public static function getInstance(): self
    {
        return static::$instance ??= new self();
    }

    public function get(string $uri, $action): RouteDefinition
    {
        return $this->addRoute('GET', $uri, $action);
    }

    public function post(string $uri, $action): RouteDefinition
    {
        return $this->addRoute('POST', $uri, $action);
    }

    protected function addRoute(string $method, string $uri, $action): RouteDefinition
    {
        $route = new RouteDefinition($method, $uri, $action);
        $this->routes[] = $route;
        return $route;
    }

    public function routeByName(string $name): ?RouteDefinition
    {
        foreach ($this->routes as $route) {
            if ($route->name === $name) {
                return $route;
            }
        }
        return null;
    }

    public function dispatch(string $method, string $uri): void
    {
        $uri = parse_url($uri, PHP_URL_PATH);

        if (defined('BASE_URI')) {
            if (str_starts_with($uri, BASE_URI)) {
                $uri = substr($uri, strlen(BASE_URI));
            }
        }

        $uri = rtrim($uri, '/') ?: '/';

        // 🔹 Create Request object once
        $request = Request::capture();

        foreach ($this->routes as $route) {
            if ($route->method === $method && $route->uri === $uri) {
                $this->runAction($route->action, $request);
                return;
            }
        }

        http_response_code(404);
        echo '404 Not Found';
    }


    protected function runAction($action, Request $request): void
    {
        if (is_callable($action)) {
            $action($request);
            return;
        }

        if (is_array($action)) {
            [$class, $method] = $action;

            $controller = new $class;

            // 🔹 If controller method expects Request, pass it
            $reflection = new \ReflectionMethod($controller, $method);

            if ($reflection->getNumberOfParameters() > 0) {
                $controller->$method($request);
            } else {
                $controller->$method();
            }

            return;
        }

        throw new \Exception('Invalid route action');
    }


}
