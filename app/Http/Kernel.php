<?php

namespace App\Http;

use App\Http\Request;
use App\Http\Response;
use App\Http\Router\Router;
use App\Http\Contracts\ResponseMiddleware;
use App\Core\Pipeline\Pipeline;
use App\Core\Container\Container;


class Kernel
{
    /**
     * Global request middleware
     */
    protected array $middleware = [];

    /**
     * Global response middleware
     */
    protected array $responseMiddleware = [];
    
    protected Container $container;
    protected Router $router;

    public function __construct(Container $container, Router $router) {
        $this->container = $container;
        $this->router = $router;
    }

    public function getRouter(): Router
    {
        return $this->router;
    }
    
    /**
     * ENTRY POINT
     */
    public function handle(Request $request): Response
    {
        // 🔥 1. GLOBAL PIPELINE (request lifecycle)
        $response = (new Pipeline($this->container))
            ->send($request)
            ->through($this->resolveMiddleware($this->middleware))
            ->then(function ($request) {

                // 🔥 2. ROUTER (ahora el router maneja su propio pipeline interno)
                $result =$this->router->dispatch($request);

                // 🔥 3. normalize controller output
                return $this->prepareResponse($result);
            });

        // 🔥 4. RESPONSE MIDDLEWARE PIPELINE
        $response = $this->runResponseMiddleware($response);

        return $response;
    }

    /**
     * RESPONSE MIDDLEWARE PIPELINE
     */
    protected function runResponseMiddleware(Response $response): Response
    {
        return (new Pipeline($this->container))
            ->send($response)
            ->through($this->responseMiddleware)
            ->then(fn ($response) => $response);

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
     * RESOLVE MIDDLEWARE ALIASES (GLOBAL ONLY)
     */
    public function resolveMiddleware(array $middlewares): array
    {
        return $middlewares;
    }

        
}