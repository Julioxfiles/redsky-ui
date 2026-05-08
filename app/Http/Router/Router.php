<?php

namespace App\Http\Router;

use App\Http\Request;
use Closure;

class Router
{
    protected static ?self $instance = null;

    protected array $routes = [];
    protected array $middlewareAliases = [];

    /**
     * Singleton
     */
    public static function getInstance(): self
    {
        return static::$instance ??= new self();
    }

    /**
     * Register GET route
     */
    public function get(string $uri, $action): RouteDefinition
    {
        return $this->addRoute('GET', $uri, $action);
    }

    /**
     * Register POST route
     */
    public function post(string $uri, $action): RouteDefinition
    {
        return $this->addRoute('POST', $uri, $action);
    }

    /**
     * Store route definition
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
     * MAIN RESPONSIBILITY:
     * Only resolve route and return raw result
     */
    public function dispatch(Request $request)
    {
        $method = $request->method();

        // ============================
        // URI NORMALIZATION (FIX)
        // ============================
        $uri = parse_url($request->uri(), PHP_URL_PATH);

        if (!empty(BASE_URI)) {
            $uri = str_replace(BASE_URI, '', $uri);
        }

       // $uri = '/' . trim($uri, '/');       
        $uri = rtrim($uri, '/') ?: '/';

        foreach ($this->routes as $route) {

            if ($route->method === $method && $route->uri === $uri) {

                $middlewares = $this->resolveMiddleware(
                    $route->getMiddlewares()
                );

                return $this->runRouteMiddleware(
                    $middlewares,
                    $request,
                    fn ($request) => $this->runAction(
                        $route->action,
                        $request
                    )
                );

            }
        }

        // Not found (RAW result, Kernel decides response)
        return [
            'error' => '404 Not Found',
            'status' => 404
        ];
    }

    /**
     * Execute controller or closure
     */
    protected function runAction($action, Request $request)
    {
        // Closure route
        if (is_callable($action)) {
            return $action($request);
        }

        // Controller route
        if (is_array($action)) {
            [$class, $method] = $action;

            $controller = new $class;

            return $controller->$method($request);
        }

        throw new \Exception('Invalid route action');
    }

    protected function runRouteMiddleware(
        array $middlewares,
        Request $request,
        Closure $destination
    ) {

        $pipeline = array_reduce(

            array_reverse($middlewares),

            function ($next, $middlewareClass) {

                return function ($request) use (
                    $middlewareClass,
                    $next
                ) {

                    $middleware = app()->make(
                        $middlewareClass
                    );

                    return $middleware->handle(
                        $request,
                        $next
                    );
                };
            },

            $destination
        );

        return $pipeline($request);
    }

    /**
     * Middleware alias system (kept for future, NOT used here yet)
     */
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