<?php

namespace App\Support\View;

class View
{
    public static function make(string $view, array $data = []): void
    {
        $compiler = new ViewCompiler();
        $compiled = $compiler->compile($view);

        extract($data, EXTR_SKIP);

        ob_start();
        require $compiled;
        $content = ob_get_clean();

        // ¿Tiene layout?
        if ($layout = ViewState::getExtends()) {

            ViewState::setExtends(null);

            // Compilamos el layout
            $layoutCompiled = $compiler->compile($layout);

            // Renderizamos el layout (YA con secciones cargadas)
            require $layoutCompiled;

            ViewState::clear();
            return;
        }


        // Vista final (layout o vista simple)
        echo $content;
        ViewState::clear();
    }

}
