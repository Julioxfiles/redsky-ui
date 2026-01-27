<?php
declare(strict_types=1);

/**
 * Session helpers.
 *
 * Helpers in this file:
 * - session()
 */

if (! function_exists('session')) {

    /**
     * Get or set session values.
     *
     * Examples:
     *  session('user_id');
     *  session('user_id', 10);
     *  session()->all();
     */
    function session(?string $key = null, mixed $value = null): mixed
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Get full session array
        if ($key === null) {
            return $_SESSION;
        }

        // Setter
        if (func_num_args() === 2) {
            $_SESSION[$key] = $value;
            return $value;
        }

        // Getter
        return $_SESSION[$key] ?? null;
    }
}
