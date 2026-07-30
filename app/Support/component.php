<?php

declare(strict_types=1);

use App\UI\ComponentManager;


if (! function_exists('component')) {

    /**
     * Render a UI component.
     */
    function component(
        string $name,
        array $config = []
    ): string {

        $manager = app(
            ComponentManager::class
        );


        return $manager->render(
            $name,
            $config
        );
    }
}


/*
|--------------------------------------------------------------------------
| Responsabilidad de este archivo
|--------------------------------------------------------------------------
|
| Este archivo contiene el helper global para renderizar componentes UI.
|
| Su responsabilidad es:
|
| - Proporcionar una función simple:
|
|     component('button', [
|         'text' => 'Guardar'
|     ]);
|
| - Delegar la creación del componente a ComponentManager.
|
| Flujo:
|
| Vista
|   |
|   v
| component()
|   |
|   v
| ComponentManager
|   |
|   v
| Librería UI activa
|   |
|   v
| Bootstrap / Tailwind
|
| Este archivo NO debe:
|
| - Crear HTML directamente.
| - Conocer Bootstrap.
| - Conocer Tailwind.
| - Resolver layouts.
|
| Solamente sirve como acceso sencillo al sistema de componentes.
|
*/