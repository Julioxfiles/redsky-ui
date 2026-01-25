<?php
declare(strict_types=1);

function service(string $id)
{
    global $container;

    if (!isset($container[$id])) {
        throw new RuntimeException("Service [$id] not found.");
    }

    return $container[$id]();
}

use App\Http\Router\Router;

if (! function_exists('route')) {
    function route(string $name): string
    {
        $route = Router::getInstance()->routeByName($name);

        if (! $route) {
            throw new Exception("Route '{$name}' not found.");
        }

        return $route->uri;
    }
}

use App\Support\View\View;

function view(string $view, array $data = []): void
{
    View::make($view, $data);
}

if (! function_exists('asset')) {
    function asset(string $path): string
    {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            ? 'https'
            : 'http';

        $host = $_SERVER['HTTP_HOST'];
        $basePath = defined('BASE_PATH') ? BASE_PATH : '';

        return "{$scheme}://{$host}" . rtrim($basePath, '/') . '/' . ltrim($path, '/');
    }

}

function include_view(string $name, array $data = []): void
{
    extract($data);

    $path = BASE_PATH . '/resources/views/' . str_replace('.', '/', $name) . '.php';

    if (!file_exists($path)) {
        throw new Exception("Included view '{$name}' not found.");
    }

    require $path;
}

use App\Support\View\ViewState;

function section(string $name): void
{
    ViewState::startSection($name);
}

function endsection(): void
{
    ViewState::endSection();
}

function yield_section(string $name): void
{
    ViewState::yield($name);
}

function base_path(string $path = ''): string
{
    return rtrim(BASE_PATH, '/') . ($path ? '/' . ltrim($path, '/') : '');
}

use App\Support\Security\Csrf;

if (!function_exists('csrf_field')) {
    function csrf_field(): string
    {
        $token = Csrf::token();

        return '<input type="hidden" name="_token" value="' .
               htmlspecialchars($token, ENT_QUOTES, 'UTF-8') .
               '">';
    }
}

if (!function_exists('redirect')) {

    /**
     * Redirect to a given URL
     */
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

if (! function_exists('session')) {
    function session(string $key = null, $default = null)
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if ($key === null) {
            return $_SESSION;
        }

        return $_SESSION[$key] ?? $default;
    }
}
