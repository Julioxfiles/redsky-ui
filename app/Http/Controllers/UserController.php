<?php

namespace App\Http\Controllers;

class UserController extends Controller
{
    public function index(): void
    {
        $response = $this->fetchUsersFromApi();

        view('users.index', [
            'users' => $response['data'] ?? []
        ]);
    }
    
    private function fetchUsersFromApi(): array
    {
        $ch = curl_init(config('api.base_url') . '/api/users');

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . ($_SESSION['token'] ?? '')
            ],
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true) ?? [];
    }
}