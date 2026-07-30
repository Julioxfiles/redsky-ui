<?php

declare(strict_types=1);

namespace App\UI\Foundation;

use App\UI\Html\Attributes;

abstract class Component
{
    /**
     * Render HTML attributes.
     *
     * @param array<string,mixed> $attributes
     */
    protected static function attributes(array $attributes): string
    {
        return Attributes::render($attributes);
    }

    /**
     * Escape HTML.
     */
    protected static function e(
        string|int|float|null $value
    ): string
    {
        return htmlspecialchars(
            (string)$value,
            ENT_QUOTES,
            'UTF-8'
        );
    }
}