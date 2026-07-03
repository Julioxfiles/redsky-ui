<?php

declare(strict_types=1);

namespace App\View;

use RedSky\Framework\View\Contracts\UiLibrary;

final class UI
{
    private static ?UiLibrary $library = null;

    public static function set(UiLibrary $library): void
    {
        self::$library = $library;
    }

    public static function library(): UiLibrary
    {
        return self::$library;
    }
}