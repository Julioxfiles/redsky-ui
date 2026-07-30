<?php

namespace App\Http\Controllers;


class UserController
{
    public function index()
    {
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


        return view('users.index')
            ->withData([
                'users' => $users
            ])
            ->layout('layouts.app')
            ->title('Listado de usuarios');
    }
}