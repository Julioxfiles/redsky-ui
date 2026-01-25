<?php
declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Request;

class RegisterController extends Controller
{
    /**
     * Show register form
     */
    public function show(): void
    {
        //dd("Si llega aqui al methodo show.");
        $this->view('auth.register', [
            'errors' => $_SESSION['errors'] ?? [],
            'old'    => $_SESSION['old'] ?? []
        ]);

        unset($_SESSION['errors'], $_SESSION['old']);
    }

    /**
     * Handle register form submission (UI only)
     */
    public function store(Request $request): void
    {
        $data = $request->all();

        // Save old input for UI repopulation
        $_SESSION['old'] = $data;

        $errors = [];

        if (empty($data['name'])) {
            $errors['name'] = 'Name is required';
        }

        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        }

        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        }

        if (($data['password'] ?? '') !== ($data['password_confirmation'] ?? '')) {
            $errors['password_confirmation'] = 'Passwords do not match';
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $this->redirect('/register');
            return;
        }

        /**
         * 🚧 TEMPORARY
         * Here later we will send data to skynet-api
         */
        $_SESSION['success'] = 'Registration form submitted successfully';

        $this->redirect('/register');
    }
}
