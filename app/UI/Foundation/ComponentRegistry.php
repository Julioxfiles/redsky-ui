<?php

declare(strict_types=1);

namespace App\UI\Foundation;

final class ComponentRegistry
{
    protected array $components = [];

    public function register(string $name, string $component): void
    {
        $this->components[$name] = $component;
    }

    public function get(string $name): ?string
    {
        return $this->components[$name] ?? null;
    }
}