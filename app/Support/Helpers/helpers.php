<?php
declare(strict_types=1);

use App\Support\Security\Csrf;
use App\Http\Router\Router;

/*
|--------------------------------------------------------------------------
| VIEW
|--------------------------------------------------------------------------
*/
if (!function_exists('view')) {
    function view(string $view, array $data = [])
    {
        return (new \App\View\View())->render($view, $data);
    }
}    

/*
|--------------------------------------------------------------------------
| ESCAPE (CRÍTICO PARA BLADE)
|--------------------------------------------------------------------------
*/

if (!function_exists('e')) {
    function e($value): string
    {
        return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
    }
}

/*
|--------------------------------------------------------------------------
| CSRF
|--------------------------------------------------------------------------
*/

if (!function_exists('csrf_token')) {
    function csrf_token(): string
    {
        return Csrf::token();
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string
    {
        return '<input type="hidden" name="_token" value="' . e(csrf_token()) . '">';
    }
}

/*
|--------------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------------
*/

if (!function_exists('config')) {
    function config(?string $key = null, $default = null)
    {
        static $configs = [];

        if (empty($configs)) {
            foreach (glob(base_path('config/*.php')) as $file) {
                $name = basename($file, '.php');
                $configs[$name] = require $file;
            }
        }

        if ($key === null) {
            return $configs;
        }

        $segments = explode('.', $key);
        $value = $configs;

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value;
    }
}

/*
|--------------------------------------------------------------------------
| ROUTE
|--------------------------------------------------------------------------
*/

if (!function_exists('route')) {
    function route(string $name): string
    {
        if (!class_exists(Router::class)) {
            throw new RuntimeException("Router not available.");
        }

        $route = Router::getInstance()->routeByName($name);

        if (!$route) {
            throw new RuntimeException("Route '{$name}' not found.");
        }

        return $route->uri;
    }
}

/*
|--------------------------------------------------------------------------
| URL / ASSET
|--------------------------------------------------------------------------
*/

if (!function_exists('asset')) {
    function asset(string $path): string
    {
        $path = ltrim($path, '/');

        $appUrl = config('app.url');

        if ($appUrl) {
            return rtrim($appUrl, '/') . '/' . $path;
        }

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            ? 'https'
            : 'http';

        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

        return "{$scheme}://{$host}/{$path}";
    }
}

if (!function_exists('url')) {
    function url(string $path = ''): string
    {
        $path = ltrim($path, '/');

        $appUrl = config('app.url');

        if ($appUrl) {
            return rtrim($appUrl, '/') . ($path ? '/' . $path : '');
        }

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            ? 'https'
            : 'http';

        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

        return "{$scheme}://{$host}" . ($path ? '/' . $path : '');
    }
}

/*
|--------------------------------------------------------------------------
| PATH
|--------------------------------------------------------------------------
*/

if (!function_exists('base_path')) {
    function base_path(string $path = ''): string
    {
        $base = rtrim(BASE_PATH, '/');

        return $path
            ? $base . '/' . ltrim($path, '/')
            : $base;
    }
}

/*
|--------------------------------------------------------------------------
| SESSION
|--------------------------------------------------------------------------
*/

if (!function_exists('session')) {
    function session($key = null, $value = null)
    {
        static $session;

        if (!$session) {
            $session = new \App\Core\Session\Session();
        }

        if (is_array($key)) {
            foreach ($key as $k => $v) {
                $session->put($k, $v);
            }
            return $session;
        }

        if ($value !== null) {
            $session->put($key, $value);
            return $session;
        }

        if ($key === null) {
            return $session;
        }

        return $session->get($key);
    }
}

/*
|--------------------------------------------------------------------------
| REDIRECT
|--------------------------------------------------------------------------
*/

if (!function_exists('redirect')) {
    function redirect(string $url, int $status = 302): void
    {
        if (headers_sent()) {
            echo "<script>window.location.href='{$url}';</script>";
            exit;
        }

        header("Location: {$url}", true, $status);
        exit;
    }
}

/*
|--------------------------------------------------------------------------
| BACK
|--------------------------------------------------------------------------
*/

if (!function_exists('back')) {
    function back(): void
    {
        redirect($_SERVER['HTTP_REFERER'] ?? '/');
    }
}

/*
|--------------------------------------------------------------------------
| ABORT
|--------------------------------------------------------------------------
*/

if (!function_exists('abort')) {
    function abort(int $status = 404, string $message = ''): void
    {
        http_response_code($status);
        echo $message;
        exit;
    }
}