<?php

use App\Http\Router\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Response;

Route::get('/', function () {
    echo 'Home page';
});

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/register', [RegisterController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register'])->name('register.post');

//Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/users', [UserController::class, 'index']);

Route::get('/test', function ($request) {
    return Response::ok([
        'message' => 'Router is working',
        'method'  => $request->method(),
        'uri'     => $request->uri(),
    ]);
});

Route::get('/dashboard', function () {
    return 'Dashboard OK';
})->middleware(['auth']);
