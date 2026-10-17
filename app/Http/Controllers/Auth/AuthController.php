<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use RedSky\Framework\Http\Controllers\Controller;

/**
 * Handles authentication pages and requests.
 *
 * Registration and authentication operations are delegated
 * to the RedSky API.
 */
class AuthController extends Controller
{
    /**
     * Display the registration form.
     */
    public function registerForm() {
        return view('auth.register')
            ->withData([
                'title' => 'Register',
            ])
            ->layout('layouts.app')
            ->title('Register');

    }

    /**
     * Process a registration request.
     */
    public function register()
    {
        
    }
}