<?php

namespace App\View;

class View
{
    protected string $basePath;

    /**
     * Cache de rutas resueltas
     */
    protected array $resolved = [];

    public function __construct()
    {
        $this->basePath = rtrim(base_path('resources/views/'), '/') . '/';
    }

    /**
     * Render principal
     */
    public function render(string $view, array $data = []): string
    {
        $viewPath = $this->resolve($view);

        if (!is_file($viewPath)) {
            throw new \Exception("View [{$view}] no existe.");
        }

        // Render vista principal
        $content = $this->renderPhp($viewPath, $data);

        // Resolver layout (solo una vez)
        $layoutPath = $this->resolve('layouts.app');

        if (is_file($layoutPath)) {
            return $this->renderPhp($layoutPath, array_merge($data, [
                'content' => $content
            ]));
        }

        return $content;
    }

    /**
     * Render PHP con buffering
     */
    protected function renderPhp(string $path, array $data): string
    {
        // Aislar variables
        extract($data, EXTR_SKIP);

        ob_start();

        try {
            require $path;
        } catch (\Throwable $e) {
            ob_end_clean();
            throw $e;
        }

        return ob_get_clean();
    }

    /**
     * Resolver path de vista con cache
     */
    protected function resolve(string $view): string
    {
        if (isset($this->resolved[$view])) {
            return $this->resolved[$view];
        }

        $path = $this->basePath
            . str_replace('.', '/', $view)
            . '.php';

        return $this->resolved[$view] = $path;
    }
}