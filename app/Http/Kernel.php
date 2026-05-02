<?php

namespace App\Http;

use App\Http\Request;
use App\Http\Response;
//use App\Http\Pipeline;
use App\Http\Router\Router;

class Kernel
{
    /**
     * Global middleware stack
     */
    protected array $middleware = [];

    /**
     * Route middleware groups (Laravel-style)
     */
    protected array $middlewareGroups = [
        'web' => [],
        'api' => [],
    ];

    /**
     * Named middleware aliases
     */
    protected array $routeMiddleware = [];

    /**
     * Entry point
     */
    public function handle(Request $request): Response
    {
        // 1. Bootstrap request lifecycle
        $request = $this->bootstrap($request);

        // 2. Run global middleware pipeline (future use)
        $request = $this->runGlobalMiddleware($request);

        // 3. Dispatch router
        $result = Router::getInstance()->dispatch($request);

        // 4. Convert to Response
        $response = $this->prepareResponse($result);

        // 5. Run response middleware (future use)
        $response = $this->runResponseMiddleware($response);

        return $response;
    }

    /*
        use App\Http\Pipeline;
        use App\Http\Router\Router;
        use App\Http\Response;

        public function handle(Request $request): Response
        {
            $router = Router::getInstance();

            $routeResult = (new Pipeline())
                ->send($request)
                ->through([
                    // aquí middleware globales si quieres
                ])
                ->then(function ($request) use ($router) {

                    return $router->dispatch($request);
                });

            return $this->prepareResponse($routeResult);
        }
    */

    /**
     * Bootstrapping logic (config, env, bindings, etc)
     */
    protected function bootstrap(Request $request): Request
    {
        // Aquí luego puedes:
        // - cargar config
        // - iniciar container
        // - sessions
        // - auth

        return $request;
    }

    /**
     * Global middleware pipeline (LIKE Laravel)
     */
    protected function runGlobalMiddleware(Request $request): Request
    {
        foreach ($this->middleware as $middleware) {
            $instance = new $middleware;

            $request = $instance->handle($request, function ($req) {
                return $req;
            });
        }

        return $request;
    }

    /**
     * Normalize ANY controller output into Response
     */
    protected function prepareResponse($result): Response
    {
        return match (true) {

            $result instanceof Response => $result,

            is_string($result) => Response::html($result),

            is_array($result) => Response::json($result),

            is_null($result) => Response::json([
                'error' => 'Empty response'
            ], 500),

            default => Response::json([
                'error' => 'Invalid response type',
                'data' => $result
            ], 500),
        };
    }

    /**
     * Response middleware (future: headers, compression, etc)
     */
    protected function runResponseMiddleware(Response $response): Response
    {
        foreach ($this->middleware as $middleware) {
            if (method_exists($middleware, 'after')) {
                $instance = new $middleware;
                $response = $instance->after($response);
            }
        }

        return $response;
    }

    /**
     * Register global middleware
     */
    public function addMiddleware(string $middleware): void
    {
        $this->middleware[] = $middleware;
    }

    /**
     * Register route middleware alias
     */
    public function routeMiddleware(string $key, string $class): void
    {
        $this->routeMiddleware[$key] = $class;
    }

    /**
     * Resolve middleware aliases
     */
    public function resolveMiddleware(array $middlewares): array
    {
        return array_map(function ($mw) {
            return $this->routeMiddleware[$mw] ?? $mw;
        }, $middlewares);
    }
}