<?php

namespace App\Http\Controllers;

use App\Http\Request;
use App\Support\ApiClient;

class UserController extends Controller
{
    public function index(): void
    {
        //$response = $this->fetchUsersFromApi();

        view('users.index', [
            'users' => $response['data'] ?? []
        ]);
    }
    
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        // Validación básica
        if (empty($email) || empty($password)) {

            flash_old_input($request->all());

            return redirect('/login');
        }

        // Llamada a API usando service
        $response = ApiClient::service('redsky')
            ->post('/login', [
                'email' => $email,
                'password' => $password,
            ]);

        // Error de autenticación
        if (!$response['success']) {

            flash_old_input($request->all());

            return redirect('/login');
        }

        // Login OK (usar Session helper)
        session([
            'token' => $response['data']['token'] ?? null,
            'user'  => $response['data']['user'] ?? null,
        ]);

        return redirect('/dashboard');
    }

    private function fetchUsersFromApi(): array
    {
        return ApiClient::service('redsky')
            ->withToken(session('token'))
            ->get('/users');
    }

}