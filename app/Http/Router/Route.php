<?php

namespace App\Http\Router;

namespace App\Http\Router;

class Route
{
    public static function get(string $uri, $action): RouteDefinition
    {
        return Router::getInstance()->get($uri, $action);
    }

    public static function post(string $uri, $action): RouteDefinition
    {
        return Router::getInstance()->post($uri, $action);
    }
}
