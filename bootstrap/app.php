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
    (new $provider($app))->register();
}

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