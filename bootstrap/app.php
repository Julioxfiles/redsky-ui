<?php

declare(strict_types=1);

use App\Providers\AppServiceProvider;
use RedSky\Framework\Foundation\Application;

/*
|--------------------------------------------------------------------------
| Create Application
|--------------------------------------------------------------------------
*/

$app = Application::getInstance();


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