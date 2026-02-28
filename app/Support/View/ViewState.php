<?php

namespace App\Support\View;

class ViewState
{
    protected static array $sections = [];
    protected static array $sectionStack = [];
    protected static ?string $extends = null;
    protected static array $onceStack = [];
    protected static array $componentSlots = [];

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

    public static function getSection(string $name): ?string
    {
        return static::$sections[$name] ?? null;
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
       Once
       ========================= */
    public static function startOnce(string $key): bool
    {
        if (isset(static::$onceStack[$key])) return false;
        static::$onceStack[$key] = true;
        ob_start();
        return true;
    }

    public static function endOnce(): string
    {
        return ob_get_clean();
    }

    /* =========================
       Component slots
       ========================= */
    public static function startSlot(string $component, string $name): void
    {
        ob_start();
    }

    public static function endSlot(string $component, string $name): void
    {
        static::$componentSlots[$component][$name] = ob_get_clean();
    }

    public static function getSlot(string $component, string $name): ?string
    {
        return static::$componentSlots[$component][$name] ?? null;
    }

    /* =========================
       Clear all
       ========================= */
    public static function clear(): void
    {
        static::$sections = [];
        static::$sectionStack = [];
        static::$extends = null;
        static::$onceStack = [];
        static::$componentSlots = [];
    }
}