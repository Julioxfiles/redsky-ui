<?php

namespace App\Core\Providers;

use App\Http\Kernel;
use App\Http\Router\Router;
use App\Http\Middlewares\AuthMiddleware;
use Override;

class AppServiceProvider extends ServiceProvider
{
    protected Kernel $kernel;

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    public function register(): void
    {
        // Middleware aliases (route middleware system)
        $this->kernel->getRouter()->aliasMiddleware(
            'auth',
            AuthMiddleware::class
        );
    }
}