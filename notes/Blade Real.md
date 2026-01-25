Perfecto. Vamos a hacerlo **como Blade de verdad**, pero **simple, claro y sin magia**.
Cuando termines esto vas a entender **uno de los secretos más importantes de Laravel**.

---

# 🧠 Idea clave (Blade real)

Blade **NO renderiza HTML directamente**.

Hace esto:

```
login.blade.php
        ↓ (compila UNA VEZ)
storage/framework/views/abc123.php
        ↓
require ese PHP (rápido)
```

👉 **Blade = compilador de vistas a PHP + cache**

---

# 🎯 Objetivo

Implementar esto:

* 📄 `resources/views/auth/login.blade.php`
* ⚙️ Se compila a PHP
* 💾 Se guarda en `storage/views`
* 🚀 En siguientes requests NO se recompila

---

# 📁 Estructura final

```
skynet-ui/
├── app/
│   └── Support/
│       └── View/
│           ├── ViewCompiler.php
│           └── View.php
├── resources/
│   └── views/
│       └── auth/
│           └── login.blade.php
├── storage/
│   └── views/
├── public/
│   └── index.php
```

---

# 1️⃣ Crear carpeta de cache

```bash
mkdir storage/views
```

---

# 2️⃣ ViewCompiler (el corazón)

📄 `app/Support/View/ViewCompiler.php`

```php
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
        $viewPath = $this->viewsPath . '/' . str_replace('.', '/', $view) . '.blade.php';

        if (!file_exists($viewPath)) {
            throw new \Exception("View [$view] not found.");
        }

        $compiledPath = $this->compiledPath($viewPath);

        if (!file_exists($compiledPath) || filemtime($viewPath) > filemtime($compiledPath)) {
            $contents = file_get_contents($viewPath);
            $contents = $this->compileEcho($contents);

            file_put_contents($compiledPath, $contents);
        }

        return $compiledPath;
    }

    protected function compiledPath(string $viewPath): string
    {
        return $this->cachePath . '/' . md5($viewPath) . '.php';
    }

    protected function compileEcho(string $value): string
    {
        return preg_replace('/{{\s*(.+?)\s*}}/', '<?= $1 ?>', $value);
    }
}
```

👉 Esto ya:

* Cachea
* Recompila solo si cambia
* Convierte `{{ }}` en PHP

---

# 3️⃣ View renderer

📄 `app/Support/View/View.php`

```php
<?php

namespace App\Support\View;

class View
{
    public static function make(string $view, array $data = []): void
    {
        $compiler = new ViewCompiler();
        $compiled = $compiler->compile($view);

        extract($data);
        require $compiled;
    }
}
```

---

# 4️⃣ Helper `view()`

📄 `app/Support/helpers/helpers.php`

```php
use App\Support\View\View;

function view(string $view, array $data = []): void
{
    View::make($view, $data);
}
```

👉 Ejecuta:

```bash
composer dump-autoload
```

---

# 5️⃣ Usar desde el controlador (Laravel style)

📄 `AuthController.php`

```php
public function showLoginForm(): void
{
    view('auth.login', [
        'title' => 'Login'
    ]);
}
```

---

# 6️⃣ Vista Blade real

📄 `resources/views/auth/login.blade.php`

```blade
<h2>{{ $title }}</h2>

<form method="POST" action="/login">
    <label>Email</label>
    <input type="email" name="email">

    <br><br>

    <label>Password</label>
    <input type="password" name="password">

    <br><br>

    <button type="submit">Login</button>
</form>
```

---

# 🧪 Qué pasa ahora (importante)

### Primera carga

* Lee `.blade.php`
* Compila
* Guarda en `storage/views/*.php`
* Lenta (normal)

### Segunda carga

* `require` directo
* ⚡ **MUY rápida**
* Casi como `echo`

---

# 🧠 Esto ES Blade

Lo que hiciste ahora:

✔ Compilación
✔ Cache
✔ Recompilación inteligente
✔ Separación vista / controlador

Laravel solo agrega:

* `@if`, `@foreach`
* layouts
* stacks
* CSRF
* seguridad extra

---

# 🚀 Próximo paso (elige)

1️⃣ `@extends / @section / @yield` real
2️⃣ `@include`
3️⃣ Cache invalidation avanzada
4️⃣ CSRF token como Laravel
5️⃣ Compilador completo Blade-like

👉 Dime cuál seguimos y lo construimos **como framework real** 💪
