<?php

declare(strict_types=1);

namespace App\UI\Foundation;

final class UiManager
{
    public function __construct(
        protected ComponentRegistry $registry
    ) {
    }
    
    public function component(string $name): string
    {
        $component = $this->registry->get($name);

        if ($component === null) {
            throw new \RuntimeException(
                "Component [{$name}] not registered."
            );
        }

        return $component;
    }
}