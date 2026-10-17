<?php

use RedSky\Framework\Routing\Route;
use RedSky\Framework\Http\Response;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HtmlDocumentationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/home', function ($request) {
    return 'Home OK';
});

// Ruta protegida con middleware alias
/*
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');
    */

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/

Route::get('/login', [AuthController::class, 'loginForm'])->name('login.form');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/register', [AuthController::class, 'registerForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

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

Route::get('/users', [UserController::class, 'index']);
//->middleware(['auth']);

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

use RedSky\Bootstrap\Components\Button;
use RedSky\Bootstrap\Components\Card;

Route::get('/test-bootstrap', function () {
    return Button::make([
        'text' => 'Hola RedSky',
        'type' => 'success'
    ]);
    
    /*
    return Card::make([
        'header' => 'Usuario',
        'title' => 'Juan Pérez',
        'text' => 'Perfil activo en el sistema',
        'footer' => 'Última actualización hoy'
    ]);
    */

    
});

Route::get('/html/docs', [HtmlDocumentationController::class, 'index']);
Route::get('/html/docs/components/{component}', [HtmlDocumentationController::class, 'show']);

Route::get('/test-env', function () {
    return response()->json([
        'app_env' => env('APP_ENV', 'not-defined'),
        'session_enabled' => env('SESSION_ENABLED', 'not-defined'),
    ]);
});

Route::get('/test-helpers', function () {
    return response()->json([
        'request_helper' => request() instanceof \RedSky\Framework\Http\Request,
        'response_helper' => response() instanceof \RedSky\Framework\Http\ResponseFactory,
        'method' => request()->method(),
    ]);
});

Route::get('/test-request-instance', function () {
    $first = request();

    $second = app()->container()->make(
        \RedSky\Framework\Http\Request::class
    );

    return response()->json([
        'same_instance' => $first === $second,
        'method' => $first->method(),
        'path' => $first->path(),
    ]);
});