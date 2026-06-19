<?php
declare(strict_types=1);

use App\Support\Security\Csrf;
use App\Http\Router\Router;
use App\Core\Container\Container;

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

if (!function_exists('app')) {

    function app(?string $class = null)
    {
        static $container;

        if (!$container) {
            $container = new Container();
        }

        if ($class === null) {
            return $container;
        }

        return $container->get($class);
    }
}

/*
|--------------------------------------------------------------------------
| REQUEST
|--------------------------------------------------------------------------
*/

if (!function_exists('request')) {

    function request()
    {
        return app(\App\Http\Request::class);
    }
}

/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

if (!function_exists('response')) {

    function response()
    {
        return app(\App\Http\Response::class);
    }
}

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

if (!function_exists('auth')) {

    function auth()
    {
        return app(\App\Core\Auth\Auth::class);
    }
}

/*
|--------------------------------------------------------------------------
| VIEW
|--------------------------------------------------------------------------
*/

if (!function_exists('view')) {

    function view($view, $data = [])
    {
        return app(\App\View\View::class)
            ->render($view, $data);
    }
}

/*
|--------------------------------------------------------------------------
| ESCAPE
|--------------------------------------------------------------------------
*/

if (!function_exists('e')) {

    function e($value): string
    {
        return htmlspecialchars(
            (string) ($value ?? ''),
            ENT_QUOTES,
            'UTF-8'
        );
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
        return '<input type="hidden" name="_token" value="' .
            e(csrf_token()) .
            '">';
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

            if (
                !is_array($value) ||
                !array_key_exists($segment, $value)
            ) {
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
        $route = Router::getInstance()
            ->routeByName($name);

        if (!$route) {
            throw new RuntimeException(
                "Route '{$name}' not found."
            );
        }

        return $route->uri;
    }
}

/*
|--------------------------------------------------------------------------
| URL
|--------------------------------------------------------------------------
*/

if (!function_exists('url')) {

    function url(string $path = ''): string
    {
        $path = ltrim($path, '/');

        $appUrl = config('app.url');

        if ($appUrl) {

            return rtrim($appUrl, '/') .
                ($path ? '/' . $path : '');
        }

        $scheme = (
            !empty($_SERVER['HTTPS']) &&
            $_SERVER['HTTPS'] !== 'off'
        ) ? 'https' : 'http';

        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

        return "{$scheme}://{$host}" .
            ($path ? '/' . $path : '');
    }
}

/*
|--------------------------------------------------------------------------
| ASSET
|--------------------------------------------------------------------------
*/

if (!function_exists('asset')) {

    function asset(string $path): string
    {
        return base_uri() . '/' . ltrim($path, '/');
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
| URI
|--------------------------------------------------------------------------
*/
if (!function_exists('base_uri')) {

    function base_uri(string $path = ''): string
    {
        $uri = rtrim(BASE_URI, '/');

        return $path
            ? $uri . '/' . ltrim($path, '/')
            : $uri;
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
        $session = app(\App\Core\Session\Session::class);

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
        response()
            ->redirect($url, $status)
            ->send();

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
        redirect(
            $_SERVER['HTTP_REFERER'] ?? '/'
        );
    }
}

/*
|--------------------------------------------------------------------------
| ABORT
|--------------------------------------------------------------------------
*/

if (!function_exists('abort')) {

    function abort(
        int $status = 404,
        string $message = ''
    ): void {

        response()
            ->html($message, $status)
            ->send();

        exit;
    }
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

if (!function_exists('component')) {

    function component($name, $data = [])
    {
        return app(\App\View\Component::class)
            ->render($name, $data);
    }
}

/*
|--------------------------------------------------------------------------
| OLD INPUT
|--------------------------------------------------------------------------
*/

if (!function_exists('flash_old_input')) {

    function flash_old_input(array $data): void
    {
        unset(
            $data['password'],
            $data['password_confirmation']
        );

        session()->put('_old_input', $data);
    }
}

if (!function_exists('old')) {

    function old(string $key, $default = null)
    {
        $value = session()->get('_old_input', []);

        foreach (explode('.', $key) as $segment) {

            if (
                !is_array($value) ||
                !array_key_exists($segment, $value)
            ) {
                return $default;
            }

            $value = $value[$segment];
        }

        return $value;
    }
}

if (!function_exists('clear_old_input')) {

    function clear_old_input(): void
    {
        session()->forget('_old_input');
    }
}

/*
|--------------------------------------------------------------------------
| ERRORS
|--------------------------------------------------------------------------
*/

if (!function_exists('errors')) {

    function errors($key = null)
    {
        $errors = session()->getFlash('_errors') ?? [];

        if ($key === null) {
            return $errors;
        }

        return $errors[$key][0] ?? null;
    }
}

/*
|--------------------------------------------------------------------------
| VALIDATE
|--------------------------------------------------------------------------
*/

if (!function_exists('validate')) {

    function validate(
        array $data,
        array $rules,
        array $messages = []
    ) {
        return \App\Validation\Validator::make(
            $data,
            $rules,
            $messages
        );
    }
}