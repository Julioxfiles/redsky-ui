<?php

declare(strict_types=1);

namespace App\Providers;

use RedSky\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->loadRoutes(
            BASE_PATH . '/routes/web.php'
        );
    }

    public function boot(): void
    {
        //
    }
}