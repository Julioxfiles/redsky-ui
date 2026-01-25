<?php

namespace App\Support\View;

class ViewState
{
    protected static array $sections = [];
    protected static array $sectionStack = [];
    protected static ?string $extends = null;

    /* =========================
       Sections
       ========================= */

    public static function startSection(string $name): void
    {
        static::$sectionStack[] = $name;
        ob_start();
    }

    public static function endSection(): void
    {
        $name = array_pop(static::$sectionStack);
        static::$sections[$name] = ob_get_clean();
    }

    public static function yield(string $name): void
    {
        echo static::$sections[$name] ?? '';
    }

    /* =========================
       Extends
       ========================= */

    public static function setExtends(?string $view): void
    {
        static::$extends = $view;
    }

    public static function getExtends(): ?string
    {
        return static::$extends;
    }

    /* =========================
       Reset (important)
       ========================= */

    public static function clear(): void
    {
        static::$sections = [];
        static::$sectionStack = [];
        static::$extends = null;
    }

    public static function getSection(string $name): ?string
    {
        return static::$sections[$name] ?? null;
    }
    
}
