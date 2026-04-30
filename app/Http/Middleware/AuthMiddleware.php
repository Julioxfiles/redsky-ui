<?php

namespace App\Http\Middleware;

use App\Http\Contracts\Middleware;
use App\Http\Request;
use Closure;

class AuthMiddleware implements Middleware
{
   
    public function handle(Request $request, Closure $next)
    {

        $session = new \App\Core\Session\Session;
        if (!$session->has('user')) {
            return redirect('/login');
        }

        return $next($request);
    }

}