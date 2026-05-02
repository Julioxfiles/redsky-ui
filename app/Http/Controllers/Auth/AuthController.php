<?php

namespace App\Http\Controllers\Auth;

use App\Http\Request;
use App\Http\Response;
use App\Support\ApiClient;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Show login page (UI responsibility only)
     */
    public function loginForm()
    {
        return view('auth.login', [
            'title' => 'Login'            
        ]);

    }

    /**
     * Handle login form submission
     * UI layer: only reads input + calls API + redirects
     */
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $response = ApiClient::post('/api/auth/login', [
            'email' => $email,
            'password' => $password
        ]);

        if (!empty($response['success'])) {
            $_SESSION['token'] = $response['token'] ?? null;

            return redirect('/dashboard');
        }

        return redirect('/login?error=1');
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