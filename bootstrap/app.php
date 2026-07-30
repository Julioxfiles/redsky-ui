<?php

declare(strict_types=1);

use App\Providers\AppServiceProvider;
use App\UI\Foundation\UiManager;
use App\UI\Foundation\ComponentRegistry;

use RedSky\Framework\Foundation\Application;
use RedSky\View\Foundation\ViewManager;


/*
|--------------------------------------------------------------------------
| Create Application
|--------------------------------------------------------------------------
*/

$app = Application::getInstance();



/*
|--------------------------------------------------------------------------
| Configure redsky-view
|--------------------------------------------------------------------------
|
| redsky-view is responsible for:
|
| - locating views
| - rendering PHP files
| - applying layouts
|
*/

ViewManager::configure([
    'path' => BASE_PATH . '/resources/views',
]);



/*
|--------------------------------------------------------------------------
| Register redsky-ui services
|--------------------------------------------------------------------------
|
| redsky-ui is responsible for UI orchestration.
|
| It does not render views.
| It coordinates components and UI libraries.
|
*/

$app->container()->singleton(
    ComponentRegistry::class,
    fn () => new ComponentRegistry()
);


$app->container()->singleton(
    UiManager::class,
    function ($container) {

        return new UiManager(
            $container->make(
                ComponentRegistry::class
            )
        );
    }
);



/*
|--------------------------------------------------------------------------
| Register Application Service Providers
|--------------------------------------------------------------------------
*/

foreach ([
    AppServiceProvider::class,
] as $provider) {

    $app->registerProvider(
        new $provider($app)
    );

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



return $app;