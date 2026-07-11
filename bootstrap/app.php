<?php

declare(strict_types=1);

use App\Providers\AppServiceProvider;
use RedSky\Framework\Foundation\Application;
use RedSky\View\ViewManager;

/*
|--------------------------------------------------------------------------
| Create Application
|--------------------------------------------------------------------------
*/

$app = Application::getInstance();

// Configuración de vistas
ViewManager::configure([
    'path' => BASE_PATH . '/resources/views',
    'layout' => 'layouts.app'
]);



/*
|--------------------------------------------------------------------------
| Register Application Service Providers
|--------------------------------------------------------------------------
*/

foreach ([
    AppServiceProvider::class,
] as $provider) {
    //(new $provider($app))->register();
    $app->registerProvider( new $provider($app) );
}

$app->bootProviders();

/*
|--------------------------------------------------------------------------
| Load Application Routes
|--------------------------------------------------------------------------
*/

$app->loadRoutes(
    BASE_PATH . '/routes/web.php'
);

/*
|--------------------------------------------------------------------------
| Ready
|--------------------------------------------------------------------------
*/

return $app;