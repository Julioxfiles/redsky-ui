<?php

namespace App\Core\Auth;

class Auth
{
    public function check(): bool
    {
        return session()->has('auth_token');
    }

    public function guest(): bool
    {
        return !$this->check();
    }

    public function token(): ?string
    {
        return session()->get('auth_token');
    }

    public function login(string $token): void
    {
        session()->put('auth_token', $token);
    }

    public function logout(): void
    {
        session()->forget('auth_token');
    }
}