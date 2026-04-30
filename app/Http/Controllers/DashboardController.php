<?php

namespace App\Http\Controllers;
use App\Support\View\View;

class DashboardController extends Controller
{
    public function index()
    {
      return View::make('dashboard.index');

      //var_dump($content); die();
    }
}