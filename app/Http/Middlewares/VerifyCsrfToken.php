<?php

namespace App\Http\Middlewares;

use App\Http\Contracts\Middleware;
use App\Http\Request;
use App\Http\Response;
use App\Support\Security\Csrf;
use Closure;

class VerifyCsrfToken implements Middleware
{
    public function handle(Request $request, Closure $next)
    {
        // Solo validar métodos que modifican estado
        if ($request->isPost()) {

            $token = $request->input('_token');

            if (!Csrf::verify($token)) {

                return Response::html(
                    'CSRF token mismatch.',
                    419
                );
            }
        }

        return $next($request);
    }
    
}