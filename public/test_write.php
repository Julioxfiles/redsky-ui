<?php

namespace App\Support\View;

class View
{
    public static function make(string $view, array $data = []): void
    {
        $compiler = new ViewCompiler();
        $compiled = $compiler->compile($view);

        extract($data, EXTR_SKIP);

        // Ejecutamos la vista
        ob_start();
        require $compiled;
        $html = ob_get_clean();

        // Si esta vista extiende un layout
        if ($layout = ViewState::getExtends()) {

            // Guardamos el HTML como sección content
            ViewState::startSection('content');
            echo $html;
            ViewState::endSection();

            ViewState::setExtends(null);

            // Renderizamos el layout (NO se limpia su output)
            require (new ViewCompiler())->compile($layout);

            ViewState::clear();
            return;
        }

        // Vista sin layout
        echo $html;
        ViewState::clear();
    }
}
