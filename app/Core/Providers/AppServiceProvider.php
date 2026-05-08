<?php

namespace App\Core\Providers;

use App\Http\Middleware\AuthMiddleware;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Middleware globales
        $this->kernel->addMiddleware([
            // \App\Http\Middleware\ShareSessionMiddleware::class,
        ]);

        // Middleware aliases
        $this->kernel->routeMiddleware('auth', AuthMiddleware::class);
    }
}