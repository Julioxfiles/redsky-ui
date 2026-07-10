<?php

declare(strict_types=1);

namespace App\Providers;

use RedSky\Framework\Providers\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // bindings globales del UI
        // helpers, views, componentes, etc.
    }

    public function boot(): void
    {
        // inicialización después de registrar
    }
}