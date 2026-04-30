<?php

namespace App\Http\Router;

class RouteDefinition
{
    public ?string $name = null;
    protected array $middlewares = [];

    public function __construct(
        public string $method,
        public string $uri,
        public $action
    ) {}

    public function name(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function middleware(array $middlewares): static
    {
        $this->middlewares = $middlewares;
        return $this;
    }

    public function getMiddlewares(): array
    {
        return $this->middlewares;
    }
}

/*
✔ Holds the route name
✔ Returns $this for chaining
✔ No framework coupling
*/