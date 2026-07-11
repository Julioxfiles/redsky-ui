<?php

namespace App\Http\Controllers;

use App\Services\Api;

class UserController
{
    public function index()
    {
        // Más adelante:
        // $users = Api::get('/users');

        // Por ahora datos de prueba

        $users = [

            [
                "id" => 1,
                "nombre" => "Julio",
                "email" => "julio@email.com"
            ],

            [
                "id" => 2,
                "nombre" => "Juan",
                "email" => "juan@email.com"
            ]

        ];

        return view('users.index', compact('users'));
    }
    
}