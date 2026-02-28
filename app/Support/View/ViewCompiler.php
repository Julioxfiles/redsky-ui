<?php

namespace App\Support\View;

use App\Support\View\View;
use App\Support\View\ViewState;

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

        if (!is_dir($this->cachePath)) mkdir($this->cachePath, 0777, true);

        $compiledPath = $this->cachePath . '/' . md5($viewPath) . '.php';

        if (!file_exists($compiledPath) || filemtime($viewPath) > filemtime($compiledPath)) {
            $contents = file_get_contents($viewPath);

            // Prepend imports
            $imports = "<?php\nuse App\\Support\\View\\View;\nuse App\\Support\\View\\ViewState;\n?>\n";
            $contents = $imports . $contents;

            // Directivas
            $contents = $this->compileExtends($contents);
            $contents = $this->compileIncludes($contents);
            $contents = $this->compileSections($contents);
            $contents = $this->compileYields($contents);
            $contents = $this->compileOnce($contents);
            $contents = $this->compileConditionals($contents);
            $contents = $this->compileLoops($contents);
            $contents = $this->compileLoopControl($contents);
            $contents = $this->compileComponents($contents);
            $contents = $this->compileCsrf($contents);
            $contents = $this->compileEcho($contents);

            file_put_contents($compiledPath, $contents);
        }

        return $compiledPath;
    }

    /* ========== Compiladores de directivas ========== */

    protected function compileExtends(string $value): string
    {
        return preg_replace('/@extends\s*\(\s*[\'"](.+?)[\'"]\s*\)/', '<?php ViewState::setExtends(\'$1\'); ?>', $value);
    }

    protected function compileSections(string $value): string
    {
        $value = preg_replace('/@section\s*\(\s*[\'"](.+?)[\'"]\s*\)/', '<?php ViewState::startSection(\'$1\'); ?>', $value);
        return str_replace('@endsection', '<?php ViewState::endSection(); ?>', $value);
    }

    protected function compileYields(string $value): string
    {
        return preg_replace('/@yield\s*\(\s*[\'"](.+?)[\'"]\s*\)/', '<?php ViewState::yield(\'$1\'); ?>', $value);
    }

    protected function compileConditionals(string $value): string
    {
        $value = preg_replace('/@if\s*\((.*)\)/', '<?php if ($1): ?>', $value);
        $value = preg_replace('/@elseif\s*\((.*)\)/', '<?php elseif ($1): ?>', $value);
        $value = str_replace('@else', '<?php else: ?>', $value);
        $value = str_replace('@endif', '<?php endif; ?>', $value);
        return $value;
    }

    protected function compileLoops(string $value): string
    {
        $value = preg_replace('/@foreach\s*\((.*)\)/', '<?php foreach ($1): ?>', $value);
        $value = str_replace('@endforeach', '<?php endforeach; ?>', $value);
        $value = preg_replace('/@forelse\s*\((.*)\)/', '<?php if(!empty($1)): foreach($1): ?>', $value);
        $value = str_replace('@empty', '<?php endforeach; else: ?>', $value);
        $value = str_replace('@endforelse', '<?php endif; ?>', $value);
        return $value;
    }

    protected function compileLoopControl(string $value): string
    {
        $value = str_replace('@break', '<?php break; ?>', $value);
        return str_replace('@continue', '<?php continue; ?>', $value);
    }

    protected function compileIncludes(string $value): string
    {
        return preg_replace('/@include\s*\(\s*[\'"](.+?)[\'"]\s*(?:,\s*(.+?))?\)/', '<?php View::make(\'$1\', $2 ?? get_defined_vars()); ?>', $value);
    }

    protected function compileComponents(string $value): string
    {
        // Slots
        $value = preg_replace_callback('/<x-slot\s+name=["\'](.+?)["\']\s*>(.*?)<\/x-slot>/s', function($m){
            return "<?php ViewState::startSlot('component', '{$m[1]}'); ?>{$m[2]}<?php ViewState::endSlot('component', '{$m[1]}'); ?>";
        }, $value);

        // Self-closing
        $value = preg_replace_callback('/<x-([a-z0-9\-_]+)(.*?)\s*\/>/i', function($m){
            $props = $this->parseComponentProps($m[2]);
            return "<?php View::make('components.{$m[1]}', $props); ?>";
        }, $value);

        // Normal with content
        $value = preg_replace_callback('/<x-([a-z0-9\-_]+)(.*?)>(.*?)<\/x-\1>/is', function($m){
            $props = $this->parseComponentProps($m[2]);
            return "<?php ViewState::startSlot('{$m[1]}', 'slot'); ?>{$m[3]}<?php ViewState::endSlot('{$m[1]}', 'slot'); ?><?php View::make('components.{$m[1]}', $props); ?>";
        }, $value);

        return $value;
    }

    protected function parseComponentProps(string $propsString): string
    {
        preg_match_all('/(:?)([a-zA-Z0-9_\-]+)\s*=\s*"([^"]*)"/', $propsString, $matches, PREG_SET_ORDER);
        $propArray = [];
        foreach($matches as $m){
            $isVar = $m[1] === ':';
            $value = $isVar ? $m[3] : "'{$m[3]}'";
            $propArray[] = "'{$m[2]}' => $value";
        }
        return '[' . implode(',', $propArray) . ']';
    }

    protected function compileCsrf(string $value): string
    {
        return str_replace('@csrf', '<?= csrf_field(); ?>', $value);
    }

    protected function compileEcho(string $value): string
    {
        return preg_replace('/{{\s*(.+?)\s*}}/', '<?= htmlspecialchars($1, ENT_QUOTES, "UTF-8") ?>', $value);
    }

    protected function compileOnce(string $value): string
    {
        $value = preg_replace('/@once\s*\(\s*[\'"](.+?)[\'"]\s*\)/', '<?php if(ViewState::startOnce(\'$1\')): ?>', $value);
        return str_replace('@endonce', '<?php echo ViewState::endOnce(); endif; ?>', $value);
    }
}