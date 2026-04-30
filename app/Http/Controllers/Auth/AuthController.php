<?php

namespace App\Http\Controllers\Auth;

use App\Http\Request;
use App\Support\ApiClient;

class AuthController
{
    /**
     * Show login page (UI responsibility only)
     */
    public function showLoginForm(): void
    {
        view('auth.login', [
            'title' => 'Login'
        ]);
    }

    /**
     * Handle login form submission
     * UI layer: only reads input + calls API + redirects
     */
    public function login(Request $request): void
    {
        $email = $request->input('email');
        $password = $request->input('password');

        // Call backend API through centralized client
        $response = ApiClient::post('/api/auth/login', [
            'email' => $email,
            'password' => $password
        ]);

        // Success flow
        if (!empty($response['success'])) {
            $_SESSION['token'] = $response['token'] ?? null;
            redirect('/dashboard');
            return;
        }

        // Failure flow
        redirect('/login?error=1');
    }

    /**
     * Logout UI action (optional UI-level session cleanup)
     */
    public function logout(): void
    {
        unset($_SESSION['token']);

        redirect('/login');
    }
    
}