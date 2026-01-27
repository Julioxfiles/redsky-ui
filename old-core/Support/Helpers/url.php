<?php
declare(strict_types=1);

/** Helpers in this file.
 *  (route, asset, url, base_path)
 */

use App\Http\Router\Router;

if (! function_exists('route')) {
    function route(string $name): string
    {
        $route = Router::getInstance()->routeByName($name);

        if (! $route) {
            throw new RuntimeException("Route '{$name}' not found.");
        }

        return $route->uri;
    }
}

if (! function_exists('asset')) {
    function asset(string $path): string
    {
        $path = ltrim($path, '/');

        if (function_exists('config')) {
            $appUrl = config('app.url');
            if ($appUrl) {
                return rtrim($appUrl, '/') . '/' . $path;
            }
        }

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            ? 'https'
            : 'http';

        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

        return "{$scheme}://{$host}/{$path}";
    }
}

if (! function_exists('url')) {
    /**
     * Generate a full URL to a path
     */
    function url(string $path = ''): string
    {
        $path = ltrim($path, '/');

        if (function_exists('config')) {
            $appUrl = config('app.url');
            if ($appUrl) {
                return rtrim($appUrl, '/') . ($path ? '/' . $path : '');
            }
        }

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            ? 'https'
            : 'http';

        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

        return "{$scheme}://{$host}" . ($path ? '/' . $path : '');
    }
}

if (! function_exists('base_path')) {
    function base_path(string $path = ''): string
    {
        $base = rtrim(BASE_PATH, '/');

        return $path
            ? $base . '/' . ltrim($path, '/')
            : $base;
    }
}
