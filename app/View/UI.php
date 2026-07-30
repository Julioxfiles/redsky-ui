<?php

declare(strict_types=1);

namespace App\View;

use RedSky\View\Contracts\UiLibrary;

final class UI
{
    private static ?UiLibrary $library = null;


    /**
     * Set active UI library.
     */
    public static function set(
        UiLibrary $library
    ): void {
        self::$library = $library;
    }


    /**
     * Get active UI library.
     */
    public static function library(): ?UiLibrary
    {
        return self::$library;
    }


    /**
     * Get active UI library name.
     */
    public static function name(): ?string
    {
        return self::$library?->name();
    }


    /*
    |--------------------------------------------------------------------------
    | Responsabilidad de esta clase
    |--------------------------------------------------------------------------
    |
    | Esta clase mantiene compatibilidad con una API simple para acceder
    | a la librería UI activa.
    |
    | Sus responsabilidades son:
    |
    | - Registrar una librería UI.
    | - Consultar la librería activa.
    | - Obtener el nombre de la librería actual.
    |
    | Ejemplo:
    |
    | UI::set(new BootstrapLibrary());
    |
    | UI::name();
    |
    | Resultado:
    |
    | bootstrap
    |
    | Esta clase NO debe:
    |
    | - Renderizar componentes.
    | - Resolver layouts.
    | - Administrar assets.
    | - Crear vistas.
    |
    | La administración avanzada de UI pertenece a UiManager.
    |
    */
}