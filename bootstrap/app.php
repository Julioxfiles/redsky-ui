<?php

use App\Http\Router\Router;
use App\Http\Middleware\AuthMiddleware;

/*
|--------------------------------------------------------------------------
| Router Instance (Singleton)
|--------------------------------------------------------------------------
*/

$router = Router::getInstance();

/*
|--------------------------------------------------------------------------
| Middleware Aliases
|--------------------------------------------------------------------------
*/

$router->aliasMiddleware('auth', AuthMiddleware::class);

/*
|--------------------------------------------------------------------------
| (Opcional) Registrar otros middlewares aquí
|--------------------------------------------------------------------------
*/

//$router->aliasMiddleware('guest', \App\Http\Middleware\GuestMiddleware::class ?? null);

/*
|--------------------------------------------------------------------------
| Bind global (opcional pero útil en tu arquitectura actual)
|--------------------------------------------------------------------------
*/

$GLOBALS['router'] = $router;