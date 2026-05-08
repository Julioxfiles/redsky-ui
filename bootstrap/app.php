<?php

use App\Http\Kernel;
use App\Core\Container\Container;
use App\Http\Router\Router;
use App\Http\Router\Route;
use App\Core\Providers\AppServiceProvider;

/*
|--------------------------------------------------------------------------
| BOOTSTRAP LAYER
|--------------------------------------------------------------------------
| Construye la aplicación (NO ejecuta HTTP)
*/

$container = new Container();
$kernel = new Kernel($container, new Router($container));
Route::setRouter($kernel->getRouter());

/*
|--------------------------------------------------------------------------
| SERVICE PROVIDERS (bootstrap responsibility)
|--------------------------------------------------------------------------
*/
foreach ([AppServiceProvider::class] as $providerClass) {
    $provider = new $providerClass($kernel);
    $provider->register();
}

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

require BASE_PATH . '/routes/web.php';

/*
|--------------------------------------------------------------------------
| EXPORT READY KERNEL
|--------------------------------------------------------------------------
*/

return $kernel;