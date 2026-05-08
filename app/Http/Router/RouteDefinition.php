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

    public function middleware(array|string $middlewares): static
    {
        $this->middlewares = array_merge(
            $this->middlewares,
            (array) $middlewares
        );

        return $this;
    }

    public function getMiddlewares(): array
    {
        return $this->middlewares;
    }
}

