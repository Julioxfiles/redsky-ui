<?php

namespace App\Support\View;

class ViewCompiler
{
    protected string $viewsPath;
    protected string $cachePath;

    public function __construct()
    {
        $this->viewsPath = base_path('resources/views');
        $this->cachePath = base_path('storage/views');
    }

 public function compile(string $view): string
{
    $viewPath = $this->viewsPath
        . DIRECTORY_SEPARATOR
        . str_replace('.', DIRECTORY_SEPARATOR, $view)
        . '.blade.php';

    if (!file_exists($viewPath)) {
        throw new \Exception("View [$view] not found at [$viewPath].");
    }

    // 🔥 CLAVE: asegurar carpeta de cache
    if (!is_dir($this->cachePath)) {
        mkdir($this->cachePath, 0777, true);
    }

    $compiledPath = $this->compiledPath($viewPath);

    if (!file_exists($compiledPath) || filemtime($viewPath) > filemtime($compiledPath)) {

        $contents = file_get_contents($viewPath);

        $contents = $this->compileExtends($contents);
        $contents = $this->compileSections($contents);
        $contents = $this->compileYields($contents);
        $contents = $this->compileConditionals($contents);
        $contents = $this->compileCsrf($contents);
        $contents = $this->compileEcho($contents);

        file_put_contents($compiledPath, $contents);
    }

    return $compiledPath;
}



    protected function compiledPath(string $viewPath): string
    {
        return $this->cachePath . '/' . md5($viewPath) . '.php';
    }

    /* =========================
       Directivas Blade
       ========================= */

    protected function compileExtends(string $value): string
    {
        return preg_replace(
            '/@extends\s*\(\s*[\'"](.+?)[\'"]\s*\)/',
            '<?php \\App\\Support\\View\\ViewState::setExtends(\'$1\'); ?>',
            $value
        );
    }

    protected function compileSections(string $value): string
    {
        $value = preg_replace(
            '/@section\s*\(\s*[\'"](.+?)[\'"]\s*\)/',
            '<?php \\App\\Support\\View\\ViewState::startSection(\'$1\'); ?>',
            $value
        );

        return str_replace(
            '@endsection',
            '<?php \\App\\Support\\View\\ViewState::endSection(); ?>',
            $value
        );
    }

    protected function compileYields(string $value): string
    {
        return preg_replace(
            '/@yield\s*\(\s*[\'"](.+?)[\'"]\s*\)/',
            '<?php \\App\\Support\\View\\ViewState::yield(\'$1\'); ?>',
            $value
        );
    }

    protected function compileConditionals(string $value): string
{
    // @if(...)
    $value = preg_replace(
        '/@if\s*\((.*)\)/',
        '<?php if ($1): ?>',
        $value
    );

    // @endif
    $value = str_replace(
        '@endif',
        '<?php endif; ?>',
        $value
    );

    return $value;
}


    protected function compileCsrf(string $value): string
    {
        return str_replace('@csrf', '<?= csrf_field(); ?>', $value);
    }

    protected function compileEcho(string $value): string
    {
        return preg_replace('/{{\s*(.+?)\s*}}/', '<?= htmlspecialchars($1, ENT_QUOTES, "UTF-8") ?>', $value);
    }
}
