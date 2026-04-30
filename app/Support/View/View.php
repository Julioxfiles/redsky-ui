<?php

namespace App\Support\View;

use App\Support\View\ViewCompiler;
use App\Support\View\ViewState;

class View
{
    public static function make(string $view, array $data = []): string
    {
        $compiler = new ViewCompiler();
        $compiled = $compiler->compile($view);

        extract($data, EXTR_SKIP);

        ob_start();

        // 1️⃣ Vista hija
        require $compiled;

        // 2️⃣ Layout si existe
        if ($layout = ViewState::getExtends()) {
            ViewState::setExtends(null);
            $layoutCompiled = $compiler->compile($layout);
            require $layoutCompiled;
        }

        $content = ob_get_clean(); // capturamos TODO

        // 3️⃣ Limpiamos estado
        ViewState::clear();

        return $content;
    }
}