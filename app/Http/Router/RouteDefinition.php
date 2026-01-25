<?php

namespace App\Http\Router;

class RouteDefinition
{
    public ?string $name = null;

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
}

/*
✔ Holds the route name
✔ Returns $this for chaining
✔ No framework coupling
*/