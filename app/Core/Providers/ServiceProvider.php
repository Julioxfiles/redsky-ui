<?php

namespace App\Core\Providers;

use App\Http\Kernel;

abstract class ServiceProvider
{
    protected Kernel $kernel;

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    /**
     * Register services / middleware / bindings
     */
    abstract public function register(): void;
}