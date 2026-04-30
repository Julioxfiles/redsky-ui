<?php

namespace App\Http\Router;

use App\Http\Router\RouteDefinition;
use App\Http\Request;
use App\Http\Response;

class Router
{
    protected static ?self $instance = null;
    protected array $routes = [];
    protected array $middlewareAliases = [];

    /**
     * Singleton instance of Router
     */
    public static function getInstance(): self
    {
        return static::$instance ??= new self();
    }

    /**
     * Register a GET route
     */
    public function get(string $uri, $action): RouteDefinition
    {
        return $this->addRoute('GET', $uri, $action);
    }

    /**
     * Register a POST route
     */
    public function post(string $uri, $action): RouteDefinition
    {
        return $this->addRoute('POST', $uri, $action);
    }

    /**
     * Internal method to store routes
     */
    protected function addRoute(string $method, string $uri, $action): RouteDefinition
    {
        $route = new RouteDefinition($method, $uri, $action);
        $this->routes[] = $route;

        return $route;
    }

    /**
     * Find route by name
     */
    public function routeByName(string $name): ?RouteDefinition
    {
        foreach ($this->routes as $route) {
            if ($route->name === $name) {
                return $route;
            }
        }

        return null;
    }

    /**
     * MAIN ENTRY POINT (Laravel-style concept)
     *
     * This method:
     * - matches request
     * - executes controller/action
     * - RETURNS a Response object (NOT echo)
     */
    public function dispatch(Request $request): ?Response
    {
        $method = $request->method();
        $uri = $request->uri();

        // Remove query string
        $uri = parse_url($uri, PHP_URL_PATH);

        // Remove base URI if exists
        if (defined('BASE_URI') && str_starts_with($uri, BASE_URI)) {
            $uri = substr($uri, strlen(BASE_URI));
        }

        $uri = rtrim($uri, '/') ?: '/';

        // Imprime las rutas
        /*
        foreach ($this->routes as $route) {
            var_dump($route->method, $route->uri);
        }
        */
        
        foreach ($this->routes as $route) {
            if ($route->method === $method && $route->uri === $uri) {
                // 1. Obtener middlewares de la ruta
                $middlewares = $route->getMiddlewares();

                // 2. Resolver alias → clases reales
                $middlewares = $this->resolveMiddleware($middlewares);

                // 3. Crear el core (controller execution)
                $core = function ($request) use ($route) {
                    return $this->runAction($route->action, $request);
                };

                // 4. Construir pipeline
                $pipeline = array_reduce(
                    array_reverse($middlewares),
                    function ($next, $middleware) {
                        return function ($request) use ($middleware, $next) {

                            $instance = new $middleware;

                            return $instance->handle($request, $next);
                        };
                    },
                    $core
                );

                // 5. Ejecutar pipeline
                return $pipeline($request);
            }
        }

        // No route found → return Response instead of echo
        return Response::json([
            'message' => '404 Not Found'
        ], 404);
    }

    /**
     * Executes the route action and RETURNS a Response
     */
    protected function runAction($action, Request $request): Response
    {
        // Closure
        if (is_callable($action)) {
            $result = $action($request);
        }

        // Controller
        elseif (is_array($action)) {
            [$class, $method] = $action;

            $controller = new $class;

            $reflection = new \ReflectionMethod($controller, $method);

            $result = $reflection->getNumberOfParameters() > 0
                ? $controller->$method($request)
                : $controller->$method();
        }

        else {
            throw new \Exception('Invalid route action');
        }

        // NORMALIZACIÓN AQUÍ (clave)
        return match (true) {
            $result instanceof Response => $result,
            is_string($result) => Response::html($result),
            default => Response::json($result),
        };
    }

    public function aliasMiddleware(string $name, string $class): void
    {
        $this->middlewareAliases[$name] = $class;
    }   

    public function resolveMiddleware(array $middlewares): array
    {
        return array_map(function ($middleware) {
            return $this->middlewareAliases[$middleware] ?? $middleware;
        }, $middlewares);
    }

    


}