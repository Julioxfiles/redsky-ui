<?php

namespace App\Http\Controllers\Auth;

use App\Http\Request;

class AuthController
{
    public function showLoginForm(): void
    {
        //echo 'ENTRÓ AL CONTROLADOR';
        //return;
        // require __DIR__ . '/../../../resources/views/auth/login.php';
        view('auth.login', [
             'title' => 'Login'
        ]);
        
    }


    public function login(Request $request): void
    {
        /* Antes
           $email = $_POST['email'] ?? '';
           $password = $_POST['password'] ?? '';
        */
        // Ahora usando Request $request
        $email = $request->input('email');
        $password = $request->input('password');

        //die($email." - ".$password);

        $response = $this->apiLogin($email, $password);

        if ($response['success']) {
            $_SESSION['token'] = $response['token'];
            redirect('/dashboard');
        }

        redirect('/login?error=1');
    }

    private function apiLogin(string $email, string $password): ?array
    {
        /** @var resource $ch */
        $ch = curl_init(config('api.base_url') . '/api/auth/login');
        

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => json_encode([
                'email' => $email,
                'password' => $password
            ]),
        ]);

        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);

            // Esto nos dirá EXACTAMENTE qué pasa
            die('cURL error: ' . $error);
        }

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status !== 200) {
            // La API respondió, pero con error
            die("API error HTTP {$status}: " . $response);
        }

        return json_decode($response, true);
    }


}   
