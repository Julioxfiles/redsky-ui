<?php

declare(strict_types=1);

namespace App\Providers;

use RedSky\Framework\Providers\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        /*
         * Application specific bindings.
         *
         * This provider is responsible only for
         * services created by the redsky-ui application.
         *
         * Examples:
         *
         * - User services
         * - Authentication services
         * - Application workflows
         * - Business UI services
         *
         * Core packages are registered separately:
         *
         * - redsky-framework
         * - redsky-view
         * - redsky-bootstrap
         */
    }


    public function boot(): void
    {
        //
    }
}