<?php

namespace App\Support\View;

use App\Support\View\ViewCompiler;
use App\Support\View\ViewState;

class View
{
    public static function make(string $view, array $data = []): void
    {
        $compiler = new ViewCompiler();
        $compiled = $compiler->compile($view);

        extract($data, EXTR_SKIP);

        // 1️⃣ Capturamos contenido de la vista hija
        ob_start();
        require $compiled;
        ob_end_flush();

        // 2️⃣ Si hay layout, renderizamos después con secciones ya listas
        if ($layout = ViewState::getExtends()) {
            ViewState::setExtends(null);
            $layoutCompiled = $compiler->compile($layout);
            require $layoutCompiled;
        }

        // 3️⃣ Limpiamos todo
        ViewState::clear();
    }
}