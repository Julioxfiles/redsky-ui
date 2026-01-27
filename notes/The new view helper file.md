Perfect — we’ll do this **surgically and safely** 👍
No theory now, just **clean extraction + small correct fixes**, starting with **`view.php`** exactly as you asked.

Below is a **ready-to-drop file**.

---

# 📁 `core/Helpers/view.php`

This file contains **ONLY view-related helpers**, extracted from your original code, with **minimal but correct fixes**.

```php
<?php
declare(strict_types=1);

use App\Support\View\View;
use App\Support\View\ViewState;
use App\Support\Security\Csrf;

if (! function_exists('view')) {
    /**
     * Render a view
     */
    function view(string $view, array $data = []): void
    {
        View::make($view, $data);
    }
}

if (! function_exists('include_view')) {
    /**
     * Include a partial view inside another view/layout
     */
    function include_view(string $name, array $data = []): void
    {
        extract($data, EXTR_SKIP);

        $path = base_path(
            'resources/views/' . str_replace('.', '/', $name) . '.php'
        );

        if (! file_exists($path)) {
            throw new RuntimeException("Included view '{$name}' not found.");
        }

        require $path;
    }
}

if (! function_exists('section')) {
    /**
     * Start a section
     */
    function section(string $name): void
    {
        ViewState::startSection($name);
    }
}

if (! function_exists('endsection')) {
    /**
     * End the current section
     */
    function endsection(): void
    {
        ViewState::endSection();
    }
}

if (! function_exists('yield_section')) {
    /**
     * Yield a section
     */
    function yield_section(string $name): void
    {
        ViewState::yield($name);
    }
}

if (! function_exists('csrf_field')) {
    /**
     * Render CSRF hidden input field
     */
    function csrf_field(): string
    {
        $token = Csrf::token();

        return '<input type="hidden" name="_token" value="' .
            htmlspecialchars($token, ENT_QUOTES, 'UTF-8') .
            '">';
    }
}
```

---

## ✅ What changed (important but minimal)

### ✔ 1. `include_view()` now uses `base_path()`

This removes **hard coupling** to `BASE_PATH` and makes it framework-clean.

```php
$path = base_path('resources/views/...');
```

This is **exactly how Laravel thinks**.

---

### ✔ 2. `extract()` safety flag added

```php
extract($data, EXTR_SKIP);
```

Prevents accidental variable overwrite inside views.

---

### ✔ 3. Consistent `function_exists()` guards

This allows:

* testing
* future overrides
* safe reloading

Laravel does this everywhere.

---

### ✔ 4. Responsibility is clean

This file now does **ONLY**:

* view rendering
* sections
* CSRF view helper

Nothing else. No routing. No URLs. No responses.

---

## 🧠 What is intentionally NOT here

❌ `asset()`
❌ `route()`
❌ `redirect()`
❌ `session()`
❌ `service()`

Those belong elsewhere and we’ll extract them next.

---

## 🔜 Next steps (next messages)

In the **next message**, I will:

➡️ Create **`core/Helpers/url.php`**

* `asset()` (fixed correctly)
* `route()`
* `base_path()`

Then after that:
➡️ **`core/Helpers/response.php`**

Finally:
➡️ How to **autoload helpers with Composer** (once you share your `composer.json`)

When you’re ready, just say:

> **“Next: url.php”** 🚀
