<?php

declare(strict_types=1);

namespace App\Providers;

use RedSky\Framework\Providers\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }


    public function boot(): void
    {
        /*
         * Routes are loaded by Application bootstrap:
         *
         * $app->loadRoutes(
         *     BASE_PATH . '/routes/web.php'
         * );
         *
         * This provider remains available for future
         * route-related configuration.
         */
    }


    /*
    |--------------------------------------------------------------------------
    | Responsabilidad de esta clase
    |--------------------------------------------------------------------------
    |
    | Este provider está reservado para configuración relacionada con
    | rutas de la aplicación.
    |
    | Sus responsabilidades futuras pueden ser:
    |
    | - Registrar grupos de rutas.
    | - Configurar middleware.
    | - Registrar rutas adicionales.
    |
    | Actualmente no carga rutas porque esa responsabilidad pertenece al
    | bootstrap principal de la aplicación.
    |
    | Esta clase NO debe:
    |
    | - Crear vistas.
    | - Administrar layouts.
    | - Resolver componentes UI.
    |
    */
}