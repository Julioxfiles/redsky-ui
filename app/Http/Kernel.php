<?php

namespace App\Http;

use App\Http\Request;
use App\Http\Response;
use App\Http\Router\Router;
use App\Http\Contracts\ResponseMiddleware;
use App\Http\Contracts\Middleware as MiddlewareContract;

class Kernel
{
    /**
     * Request middleware stack
     */
    protected array $middleware = [];

    /**
     * Response middleware stack
     */
    protected array $responseMiddleware = [];

    /**
     * Route middleware aliases
     */
    protected array $routeMiddleware = [];

    /**
     * Registered service providers
     */
    protected array $providers = [];
    protected bool $bootstrapped = false;
    /**
     * Entry point
     */
    public function handle(Request $request): Response
    {
        // 1. Bootstrap (routes, providers, config)
        $this->bootstrap();

        // 2. Run request middleware
        $request = $this->runGlobalMiddleware($request);

        // 3. Router dispatch
        $result = Router::getInstance()->dispatch($request);

        // 4. Normalize response
        $response = $this->prepareResponse($result);

        // 5. Run response middleware
        $response = $this->runResponseMiddleware($response);

        return $response;
    }

    /**
     * BOOTSTRAP LAYER
     */
    

    protected function bootstrap(): void
    {
        if ($this->bootstrapped) {
            return;
        }

        require BASE_PATH . '/routes/web.php';

        $this->registerProviders([
            \App\Core\Providers\AppServiceProvider::class,
        ]);

        $this->bootstrapped = true;
    }
    /**
     * REQUEST MIDDLEWARE PIPELINE
     */
    protected function runGlobalMiddleware(Request $request): Request
    {
        foreach ($this->middleware as $middlewareClass) {

            $middleware = app()->make($middlewareClass);

            if ($middleware instanceof MiddlewareContract) {
                $request = $middleware->handle($request, function ($req) {
                    return $req;
                });
            }
        }

        return $request;
    }

    /**
     * RESPONSE MIDDLEWARE PIPELINE
     */
    protected function runResponseMiddleware(Response $response): Response
    {
        foreach ($this->responseMiddleware as $middlewareClass) {

            $middleware = app()->make($middlewareClass);

            if ($middleware instanceof ResponseMiddleware) {
                $response = $middleware->after($response);
            }
        }

        return $response;
    }

    /**
     * NORMALIZE CONTROLLER OUTPUT
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
     * REGISTER REQUEST MIDDLEWARE
     */
    public function addMiddleware(array $middleware): void
    {
        foreach ($middleware as $mw) {
            $this->middleware[] = $mw;
        }
    }

    /**
     * REGISTER RESPONSE MIDDLEWARE
     */
    public function addResponseMiddleware(array $middleware): void
    {
        foreach ($middleware as $mw) {
            $this->responseMiddleware[] = $mw;
        }
    }

    /**
     * REGISTER ROUTE MIDDLEWARE ALIASES
     */
    public function routeMiddleware(string $key, string $class): void
    {
        $this->routeMiddleware[$key] = $class;
    }

    /**
     * RESOLVE ROUTE MIDDLEWARE ALIASES
     */
    public function resolveMiddleware(array $middlewares): array
    {
        return array_map(function ($mw) {
            return $this->routeMiddleware[$mw] ?? $mw;
        }, $middlewares);
    }

    /**
     * REGISTER SERVICE PROVIDERS
     */
    public function registerProviders(array $providers): void
    {
        foreach ($providers as $providerClass) {

            $provider = new $providerClass($this);

            $provider->register();

            $this->providers[] = $provider;
        }
    }

}