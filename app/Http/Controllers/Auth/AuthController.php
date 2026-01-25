<?php

namespace App\Http\Controllers\Auth;

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


    public function login(): void
    {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        $response = $this->apiLogin($email, $password);

        if ($response['success']) {
            $_SESSION['token'] = $response['token'];
            redirect('/dashboard');
        }

        redirect('/login?error=1');
    }

    private function apiLogin(string $email, string $password): array
    {
        $ch = curl_init('http://api.local/auth/login');

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => json_encode([
                'email' => $email,
                'password' => $password
            ])
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }


}
