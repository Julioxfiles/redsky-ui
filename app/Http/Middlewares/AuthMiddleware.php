<?php

namespace App\Http\Middlewares;

use Closure;
use App\Core\Auth\Auth;
use App\Http\Request;
use App\Http\Response;
use App\Http\Contracts\Middleware;

class AuthMiddleware implements Middleware
{
    protected Auth $auth;

    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    public function handle(Request $request, Closure $next)
    {
        if ($this->auth->guest()) {

            if ($request->wantsJson()) {
                return Response::json([
                    'message' => 'Unauthenticated'
                ], 401);
            }

            return Response::redirect('/login');
        }

        return $next($request);
    }
    
}