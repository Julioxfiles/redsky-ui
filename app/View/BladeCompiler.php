<?php

namespace App\View;

class BladeCompiler
{
    public array $sections = [];
    public ?string $extends = null;

    public function compile(string $content): string
    {
        $content = $this->extractExtends($content);
        $content = $this->extractSections($content);

        $content = $this->compileIncludes($content);
        $content = $this->compileCsrf($content);
        $content = $this->compileEchos($content);

        return $content;
    }

    // -------------------------
    // EXTENDS
    // -------------------------
    protected function extractExtends(string $content): string
    {
        if (preg_match('/@extends\([\'"](.+?)[\'"]\)/', $content, $m)) {
            $this->extends = $m[1];
            return str_replace($m[0], '', $content);
        }

        $this->extends = null;
        return $content;
    }

    // -------------------------
    // SECTIONS
    // -------------------------
    protected function extractSections(string $content): string
    {
        preg_match_all(
            '/@section\([\'"](.+?)[\'"]\)(.*?)@endsection/s',
            $content,
            $matches,
            PREG_SET_ORDER
        );

        foreach ($matches as $match) {
            $this->sections[$match[1]] = trim($match[2]);
            $content = str_replace($match[0], '', $content);
        }

        return $content;
    }

    // -------------------------
    // INCLUDE
    // -------------------------
    protected function compileIncludes(string $content): string
    {
        return preg_replace_callback(
            '/@include\([\'"](.+?)[\'"]\)/',
            function ($m) {
                $path = base_path(
                    'resources/views/' .
                    str_replace('.', '/', $m[1]) .
                    '.blade.php'
                );

                return file_exists($path)
                    ? file_get_contents($path)
                    : '';
            },
            $content
        );
    }

    // -------------------------
    // CSRF
    // -------------------------
    protected function compileCsrf(string $content): string
    {
        return str_replace('@csrf', '<?= csrf_field() ?>', $content);
    }

    // -------------------------
    // ECHOS
    // -------------------------
    protected function compileEchos(string $content): string
    {
        return preg_replace(
            '/\{\{\s*(.*?)\s*\}\}/s',
            '<?= e($1) ?>',
            $content
        );
    }

    // -------------------------
    // YIELD
    // -------------------------
    public function injectSections(string $layout): string
    {
        return preg_replace_callback(
            '/@yield\([\'"](.+?)[\'"]\)/',
            fn($m) => $this->sections[$m[1]] ?? '',
            $layout
        );
    }
}