<?php
declare(strict_types=1);

/** Helpers in this file.
 *  (redirect, back, abort, session)
 */

if (! function_exists('redirect')) {
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

if (! function_exists('back')) {
    /**
     * Redirect to previous location
     */
    function back(): void
    {
        $referer = $_SERVER['HTTP_REFERER'] ?? '/';
        redirect($referer);
    }
}

if (! function_exists('abort')) {
    /**
     * Abort the request with an HTTP status code
     */
    function abort(int $statusCode = 404, string $message = ''): void
    {
        http_response_code($statusCode);

        if ($message) {
            echo $message;
        }

        exit;
    }
}

if (! function_exists('session')) {
    function session(string $key = null, $value = null)
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if ($key === null) {
            return $_SESSION;
        }

        if (func_num_args() === 2) {
            $_SESSION[$key] = $value;
            return $value;
        }

        return $_SESSION[$key] ?? null;
    }
}
