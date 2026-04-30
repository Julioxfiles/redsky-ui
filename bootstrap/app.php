<?php

use App\Http\Router\Router;
use App\Http\Middleware\AuthMiddleware;

// Crear instancia (singleton o manual)
$router = Router::getInstance();

// Registrar middlewares
$router->aliasMiddleware('auth', AuthMiddleware::class);

// (opcional) guardar en contenedor o variable global