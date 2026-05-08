<?php

namespace App\Http\Controllers\Auth;

use App\Http\Request;
use App\Support\ApiClient;
use App\Http\Controllers\Controller;
use App\Validation\Validator;

class AuthController extends Controller
{
    /**
     * Show login page
     */
    public function loginForm()
    {
        //dd("hi");
        return view('auth.login', [
            'title' => 'Login'
        ]);
    }

    /**
     * Handle login
     */
    public function login(Request $request)
    {
        $data = $request->all();

        // 🔵 Validación UI
        $validator = Validator::make($data, [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if (!$validator->validate()) {
            flash_old_input($data);
            return redirect('/loginForm');
        }

        // 🔵 Llamada a API
        $response = ApiClient::service('redsky')
            ->post('/api/auth/login', $data);
        
//            dd($response);
//            die();
        // 🔴 Error de autenticación
        if (!$response['success']) {

            session()->flash('_errors', [
                'email' => ['Invalid credentials']
            ]);

            flash_old_input($data);

            auth()->logout();

            //return redirect('/login');
        }

        // 🟢 Login OK
        

        auth()->login($response['data']);

        return redirect('/dashboard');
    }

    /**
     * Logout
     */
    public function logout()
    {
        session()->forget('token');
        session()->forget('user');

        return redirect('/login');
    }

    public function registerForm()
    {
        //dd("hi");
        return view('auth.register', [
            'title' => 'Login'
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->all();

        // 🔵 Validación UI
        $validator = Validator::make($data, [
            'email' => 'required|email',
            'password' => 'required|min:6',
            'password_confirmation' => 'required|min:6'
        ]);

        if (!$validator->validate()) {
            flash_old_input($data);
            return redirect('/registerForm');
        }

        // 🔵 Validar confirmación de password
        if ($data['password'] !== $data['password_confirmation']) {
            session()->flash('_errors', [
                'password' => ['Passwords do not match']
            ]);

            flash_old_input($data);
            return redirect('/register');
        }

        // 🔵 Llamada a API
        $response = ApiClient::service('redsky')
            ->post('/api/auth/register', $data);

        // 🧪 DEBUG (quitar después)
        // dd($response);

        // 🔴 Error en API
        if (!($response['success'] ?? false)) {

            session()->flash('_errors', [
                'email' => ['Registration failed']
            ]);

            flash_old_input($data);

            return redirect('/register');
        }

        // 🟢 Registro OK → redirigir a login
        session()->flash('_success', 'Account created successfully. You can now login.');

        return redirect('/loginForm');
    }

}