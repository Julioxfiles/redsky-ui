<?php

namespace App\Support\Security;

class Csrf
{
    public static function token(): string
    {
        if (!isset($_SESSION['_csrf_token'])) {
            $_SESSION['_csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['_csrf_token'];
    }

    public static function verify(?string $token): bool
    {
        return isset($_SESSION['_csrf_token'])
            && is_string($token)
            && hash_equals($_SESSION['_csrf_token'], $token);
    }
}
