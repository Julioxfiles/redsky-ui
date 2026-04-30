<?php
declare(strict_types=1);

/** Helpers in this file.
 *  (view, include_view, section, endsection, yield_section, csrf_field, csrf_token, old)
 */

use App\Support\View\View;
use App\Support\View\ViewState;
use App\Support\Security\Csrf;

if (! function_exists('view')) {
    function view(string $view, array $data = []): \App\Http\Response
    {
        $content = \App\Support\View\View::make($view, $data);

        return \App\Http\Response::html($content);
    }
}

if (! function_exists('include_view')) {
    function include_view(string $name, array $data = []): void
    {
        extract($data, EXTR_SKIP);

        $path = base_path(
            'resources/views/' . str_replace('.', '/', $name) . '.php'
        );

        if (! file_exists($path)) {
            throw new RuntimeException("Included view '{$name}' not found.");
        }

        require $path;
    }
}

if (! function_exists('section')) {
    function section(string $name): void
    {
        ViewState::startSection($name);
    }
}

if (! function_exists('endsection')) {
    function endsection(): void
    {
        ViewState::endSection();
    }
}

if (! function_exists('yield_section')) {
    function yield_section(string $name): void
    {
        ViewState::yield($name);
    }
}

if (! function_exists('csrf_token')) {
    function csrf_token(): string
    {
        return Csrf::token();
    }
}

if (! function_exists('csrf_field')) {
    function csrf_field(): string
    {
        return '<input type="hidden" name="_token" value="' .
            htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8') .
            '">';
    }
}

if (! function_exists('old')) {
    /**
     * Retrieve old input value from session
     */
    function old(string $key, $default = null)
    {
        return session('_old')[$key] ?? $default;
    }
}
