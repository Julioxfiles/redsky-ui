<?php

namespace App\Http\Router;

use App\Http\Request;
use App\Core\Container\Container;
use Closure;

class Router
{

    protected array $routes = [];
    protected array $middlewareAliases = [];
    protected Container $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
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

    /**
     * MAIN DISPATCH (PIPELINE VERSION)
     */
    public function dispatch(Request $request)
    {
        $method = $request->method();

        $uri = parse_url($request->uri(), PHP_URL_PATH);

        if (!empty(BASE_URI)) {
            $uri = str_replace(BASE_URI, '', $uri);
        }

        $uri = rtrim($uri, '/') ?: '/';
        //dd($this->routes); die();

        foreach ($this->routes as $route) {

            if ($route->method === $method && $route->uri === $uri) {

                $middlewares = $this->resolveMiddleware(
                    $route->getMiddlewares()
                );
                
                // 🔥 PIPELINE AHORA ES EL CORE (NO array_reduce aquí)

                return (new \App\Core\Pipeline\Pipeline($this->container))
                    ->send($request)
                    ->through($middlewares)
                    ->then(function ($request) use ($route) {
                        return $this->runAction($route->action, $request);
                    });
            }
        }

        return [
            'error' => '404 Not Found',
            'status' => 404
        ];
    }

    /**
     * EXECUTE CONTROLLER / CLOSURE
     */
    protected function runAction($action, Request $request)
    {
        if (is_callable($action)) {
            return $action($request);
        }

        if (is_array($action)) {
            [$class, $method] = $action;

            $controller = new $class;

            return $controller->$method($request);
        }

        throw new \Exception('Invalid route action');
    }

    /**
     * REMOVE runRouteMiddleware (NO LONGER NEEDED)
     */

    /**
     * Middleware alias system
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