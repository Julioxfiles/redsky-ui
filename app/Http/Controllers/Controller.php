<?php
declare(strict_types=1);

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Render a blade view
     */
    protected function view(string $view, array $data = []): void
    {
        view($view, $data);
    }

    /**
     * Redirect to a URL
     */
    protected function redirect(string $url, int $status = 302): void
    {
        redirect($url, $status);
        exit;
    }

    /**
     * Redirect back to previous page
     */
    protected function back(): void
    {
        $referer = $_SERVER['HTTP_REFERER'] ?? '/';
        $this->redirect($referer);
    }

    /**
     * Flash data to session (one request only)
     */
    protected function flash(string $key, mixed $value): void
    {
        $_SESSION['_flash'][$key] = $value;
    }

    /**
     * Get flashed data
     */
    protected function getFlash(string $key, mixed $default = null): mixed
    {
        $value = $_SESSION['_flash'][$key] ?? $default;
        unset($_SESSION['_flash'][$key]);
        return $value;
    }

    /**
     * Store old input values
     */
    protected function withInput(array $input): void
    {
        $_SESSION['_old'] = $input;
    }

    /**
     * Get old input value
     */
    protected function old(string $key, mixed $default = null): mixed
    {
        return $_SESSION['_old'][$key] ?? $default;
    }

    /**
     * Store validation errors
     */
    protected function withErrors(array $errors): void
    {
        $_SESSION['_errors'] = $errors;
    }

    /**
     * Get validation errors
     */
    protected function errors(): array
    {
        return $_SESSION['_errors'] ?? [];
    }

    /**
     * Clear old input & errors
     */
    protected function clearFormState(): void
    {
        unset($_SESSION['_old'], $_SESSION['_errors']);
    }

    /**
     * Validate CSRF token
     */
    protected function validateCsrf(): void
    {
        $token = $_POST['_token'] ?? '';

        if (!isset($_SESSION['_token']) || !hash_equals($_SESSION['_token'], $token)) {
            http_response_code(419);
            exit('CSRF token mismatch');
        }
    }
}
