<?php

namespace App\Core\Session;

class Session
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    // Get
    public function get(string $key, $default = null)
    {
        return $_SESSION[$key] ?? $default;
    }

    // Set
    public function put(string $key, $value): void
    {
        $_SESSION[$key] = $value;
    }

    // Check
    public function has(string $key): bool
    {
        return isset($_SESSION[$key]);
    }

    // Remove one key
    public function forget(string $key): void
    {
        unset($_SESSION[$key]);
    }

    // Clear all session
    public function flush(): void
    {
        $_SESSION = [];
    }

    // Flash (tipo Laravel)
    public function flash(string $key, $value): void
    {
        $_SESSION['_flash'][$key] = $value;
    }

    public function getFlash(string $key, $default = null)
    {
        $value = $_SESSION['_flash'][$key] ?? $default;
        unset($_SESSION['_flash'][$key]);
        return $value;
    }

    // Raw access (opcional)
    public function all(): array
    {
        return $_SESSION;
    }
}