<?php

namespace App\View;

class Component
{
    protected string $basePath;

    public function __construct()
    {
        $this->basePath = base_path('resources/views/components/');
    }

    public function render(string $name, array $data = []): string
    {
        $path = $this->basePath . $name . '.php';

        if (!is_file($path)) {
            throw new \Exception("Component [{$name}] no existe.");
        }

        extract($data, EXTR_SKIP);

        ob_start();
        require $path;
        return ob_get_clean();
    }

}