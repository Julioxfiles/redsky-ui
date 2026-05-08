<?php

use App\Http\Router\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Response;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return 'Home page';
});

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/

Route::get('/login', [AuthController::class, 'loginForm'])->name('login.form');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/register', [AuthController::class, 'registerForm'])->name('register.form');
Route::get('/register', [AuthController::class, 'register'])->name('register.post');

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return 'Dashboard OK';
})->middleware(['auth']);

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

Route::get('/users', [UserController::class, 'index'])->middleware(['auth']);

/*
|--------------------------------------------------------------------------
| Debug
|--------------------------------------------------------------------------
*/

Route::get('/test', function ($request) {
    return Response::ok([
        'message' => 'Router is working',
        'method'  => $request->method(),
        'uri'     => $request->uri(),
    ]);
});

