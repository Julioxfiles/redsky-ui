<?php

namespace App\Http\Contracts;

use App\Http\Response;

interface ResponseMiddleware
{
    public function after(Response $response): Response;
}