<?php

namespace App\Http\Middleware;

use App\Http\Contracts\Middleware;
use App\Http\Request;
use App\Http\Response;
use Closure;

class AuthMiddleware
{
    public function handle($request, $next)
    {
        if (!$request->has('token')) {
            return Response::json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}