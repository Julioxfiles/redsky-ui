<?php

declare(strict_types=1);

namespace App\UI;

use App\UI\Contracts\UiLibrary;

final class UiManager
{
    private ?UiLibrary $library = null;


    /**
     * Set active UI library.
     */
    public function set(
        UiLibrary $library
    ): void {
        $this->library = $library;
    }


    /**
     * Get active UI library.
     */
    public function library(): ?UiLibrary
    {
        return $this->library;
    }


    /**
     * Get active UI library name.
     */
    public function name(): ?string
    {
        return $this->library?->name();
    }


    /*
    |--------------------------------------------------------------------------
    | Responsabilidad de esta clase
    |--------------------------------------------------------------------------
    |
    | Esta clase pertenece a redsky-ui y administra la librería visual
    | activa de una aplicación.
    |
    | Sus responsabilidades son:
    |
    | - Registrar la librería UI activa.
    | - Proporcionar acceso a dicha librería.
    | - Permitir cambiar entre implementaciones como:
    |
    |     - redsky-bootstrap
    |     - redsky-tailwind
    |     - futuras librerías UI
    |
    | Ejemplo:
    |
    | UI_LIBRARY=bootstrap
    |
    | UiManager
    |       |
    |       v
    | BootstrapLibrary
    |
    | Esta clase NO debe:
    |
    | - Renderizar componentes directamente.
    | - Crear HTML.
    | - Administrar layouts.
    | - Administrar assets.
    |
    | Su única responsabilidad es conocer qué librería visual está activa.
    |
    */
}