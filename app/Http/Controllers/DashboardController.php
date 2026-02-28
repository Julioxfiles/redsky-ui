<?php

namespace App\Http\Controllers;

class DashboardController extends Controller
{
    public function index(): void
    {
        view('dashboard.index');
    }
}