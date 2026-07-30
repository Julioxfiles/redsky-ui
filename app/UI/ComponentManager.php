<?php

declare(strict_types=1);

namespace App\UI;

use App\UI\Contracts\UiLibrary;

final class ComponentManager
{
    public function __construct(
        protected UiManager $uiManager
    ) {
    }


    /**
     * Render a UI component.
     */
    public function render(
        string $component,
        array $config = []
    ): string {

        $library = $this->uiManager->library();


        if ($library === null) {
            throw new \RuntimeException(
                'No UI library has been configured.'
            );
        }


        /*
         * Future implementation:
         *
         * BootstrapLibrary
         *        |
         *        v
         * Button::make()
         *
         * TailwindLibrary
         *        |
         *        v
         * Button::make()
         */


        if (! method_exists(
            $library,
            'component'
        )) {

            throw new \RuntimeException(
                'UI library does not support components.'
            );
        }


        return $library->component(
            $component,
            $config
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Responsabilidad de esta clase
    |--------------------------------------------------------------------------
    |
    | Esta clase pertenece a redsky-ui y administra la creación de
    | componentes visuales.
    |
    | Sus responsabilidades son:
    |
    | - Solicitar componentes a la librería UI activa.
    | - Mantener independiente la aplicación de la librería concreta.
    |
    | Ejemplo:
    |
    | component('button', [
    |     'text' => 'Guardar'
    | ]);
    |
    | redsky-ui
    |      |
    |      v
    | UiManager
    |      |
    |      v
    | redsky-bootstrap
    |      |
    |      v
    | Button
    |
    | Esta clase NO debe:
    |
    | - Crear HTML Bootstrap directamente.
    | - Conocer clases CSS específicas.
    | - Renderizar vistas.
    |
    | La implementación visual pertenece a cada librería UI.
    |
    */
}