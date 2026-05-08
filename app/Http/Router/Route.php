<?php

namespace App\Http\Router;

use App\Http\Router\Router;

class Route
{
    protected static Router $router;

    public static function setRouter(Router $router): void
    {
        self::$router = $router;
    }

    public static function get(string $uri, $action): RouteDefinition
    {
        return self::$router->get($uri, $action);
    }

    public static function post(string $uri, $action): RouteDefinition
    {
        return self::$router->post($uri, $action);
    }
}
