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

    /*
    |--------------------------------------------------------------------------
    | GET
    |--------------------------------------------------------------------------
    */

    public function get(string $key, $default = null)
    {
        $value = $_SESSION;

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

    /*
    |--------------------------------------------------------------------------
    | SET
    |--------------------------------------------------------------------------
    */

    public function put(string $key, $value): void
    {
        $segments = explode('.', $key);

        $session = &$_SESSION;

        foreach ($segments as $segment) {

            if (
                !isset($session[$segment]) ||
                !is_array($session[$segment])
            ) {
                $session[$segment] = [];
            }

            $session = &$session[$segment];
        }

        $session = $value;
    }

    /*
    |--------------------------------------------------------------------------
    | HAS
    |--------------------------------------------------------------------------
    */

    public function has(string $key): bool
    {
        return $this->get($key, '__missing__') !== '__missing__';
    }

    /*
    |--------------------------------------------------------------------------
    | EXISTS
    |--------------------------------------------------------------------------
    | Similar a Laravel:
    | true incluso si valor es null
    |--------------------------------------------------------------------------
    */

    public function exists(string $key): bool
    {
        $segments = explode('.', $key);

        $value = $_SESSION;

        foreach ($segments as $segment) {

            if (
                !is_array($value) ||
                !array_key_exists($segment, $value)
            ) {
                return false;
            }

            $value = $value[$segment];
        }

        return true;
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE ONE KEY
    |--------------------------------------------------------------------------
    */

    public function forget(string $key): void
    {
        $segments = explode('.', $key);

        $session = &$_SESSION;

        while (count($segments) > 1) {

            $segment = array_shift($segments);

            if (
                !isset($session[$segment]) ||
                !is_array($session[$segment])
            ) {
                return;
            }

            $session = &$session[$segment];
        }

        unset($session[array_shift($segments)]);
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAR ALL SESSION DATA
    |--------------------------------------------------------------------------
    */

    public function flush(): void
    {
        $_SESSION = [];
    }

    /*
    |--------------------------------------------------------------------------
    | DESTROY SESSION COMPLETELY
    |--------------------------------------------------------------------------
    */

    public function invalidate(): void
    {
        $_SESSION = [];

        if (session_status() === PHP_SESSION_ACTIVE) {

            session_unset();

            session_destroy();
        }
    }

    /*
    |--------------------------------------------------------------------------
    | REGENERATE SESSION ID
    |--------------------------------------------------------------------------
    */

    public function regenerate(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | FLASH DATA
    |--------------------------------------------------------------------------
    */

    public function flash(string $key, $value): void
    {
        $_SESSION['_flash'][$key] = $value;
    }

    /*
    |--------------------------------------------------------------------------
    | GET FLASH DATA
    |--------------------------------------------------------------------------
    */

    public function getFlash(string $key, $default = null)
    {
        $value = $_SESSION['_flash'][$key] ?? $default;

        unset($_SESSION['_flash'][$key]);

        return $value;
    }

    /*
    |--------------------------------------------------------------------------
    | HAS FLASH
    |--------------------------------------------------------------------------
    */

    public function hasFlash(string $key): bool
    {
        return isset($_SESSION['_flash'][$key]);
    }

    /*
    |--------------------------------------------------------------------------
    | REFLASH
    |--------------------------------------------------------------------------
    | Mantiene flash para siguiente request
    |--------------------------------------------------------------------------
    */

    public function reflash(): void
    {
        $_SESSION['_flash_next'] = $_SESSION['_flash'] ?? [];
    }

    /*
    |--------------------------------------------------------------------------
    | KEEP SPECIFIC FLASH KEYS
    |--------------------------------------------------------------------------
    */

    public function keep(array $keys): void
    {
        foreach ($keys as $key) {

            if (isset($_SESSION['_flash'][$key])) {

                $_SESSION['_flash_next'][$key]
                    = $_SESSION['_flash'][$key];
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | AGE FLASH DATA
    |--------------------------------------------------------------------------
    | Ejecutar al inicio/final del request lifecycle
    |--------------------------------------------------------------------------
    */

    public function ageFlashData(): void
    {
        unset($_SESSION['_flash']);

        $_SESSION['_flash']
            = $_SESSION['_flash_next'] ?? [];

        unset($_SESSION['_flash_next']);
    }

    /*
    |--------------------------------------------------------------------------
    | ALL SESSION DATA
    |--------------------------------------------------------------------------
    */

    public function all(): array
    {
        return $_SESSION;
    }

    /*
    |--------------------------------------------------------------------------
    | TOKEN HELPERS
    |--------------------------------------------------------------------------
    */

    public function token(): ?string
    {
        return $this->get('_csrf_token');
    }

    public function setToken(string $token): void
    {
        $this->put('_csrf_token', $token);
    }
}

