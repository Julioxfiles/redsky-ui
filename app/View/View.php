<?php

namespace App\View;

class View
{
    protected string $basePath;

    public function __construct()
    {
        $this->basePath = base_path('resources/views/');
    }

    public function render(string $view, array $data = []): string
    {
        $viewPath = $this->resolve($view);

        if (!file_exists($viewPath)) {
            throw new \Exception("View {$view} no existe.");
        }

        // 🔥 render vista hija
        $content = $this->renderPhp($viewPath, $data);

        // 🔥 layout automático
        $layoutPath = $this->resolve('layouts.app');

        if (file_exists($layoutPath)) {
            return $this->renderPhp($layoutPath, array_merge($data, [
                'content' => $content
            ]));
        }

        return $content;
    }

    protected function renderPhp(string $path, array $data): string
    {
        extract($data);

        ob_start();
        require $path;
        return ob_get_clean();
    }

    protected function resolve(string $view): string
    {
        return $this->basePath .
            str_replace('.', '/', $view) .
            '.php';
    }
}