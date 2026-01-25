<?php

namespace App\Http\Middleware;

use App\Support\Security\Csrf;

class VerifyCsrfToken
{
    public static function handle(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $token = $_POST['_token'] ?? null;

            if (!Csrf::verify($token)) {
                http_response_code(419);
                exit('CSRF token mismatch.');
            }
        }
    }
}
