sssPerfect — you’ve reached another **very important architectural milestone** 👌
You are now separating **HTTP input handling** from **controller logic**, which is exactly what a `Request` object is for.

Let’s build a **clean, minimal `Request` class** suitable for **skynet-ui**, without copying all of Laravel, and without breaking Clean Architecture.

---

# 🎯 What a `Request` class should do (UI project)

A `Request` object should:

✅ Encapsulate `$_GET`, `$_POST`, `$_FILES`, `$_SERVER`
✅ Provide a clean API to read input
✅ Sanitize access (not auto-sanitize data)
✅ Be easy to instantiate
✅ Have **zero external dependencies**
✅ NOT validate business rules
✅ NOT know anything about controllers

---

# 📁 File location

Create:

```
app/Http/Request.php
```

Namespace:

```
App\Http
```

---

# 🧠 Minimal, Clean `Request` class (READY TO USE)

### **File:** `app/Http/Request.php`

```php
<?php
declare(strict_types=1);

namespace App\Http;

class Request
{
    protected array $get;
    protected array $post;
    protected array $files;
    protected array $server;

    public function __construct(
        array $get = [],
        array $post = [],
        array $files = [],
        array $server = []
    ) {
        $this->get    = $get;
        $this->post   = $post;
        $this->files  = $files;
        $this->server = $server;
    }

    /**
     * Create Request from PHP globals
     */
    public static function capture(): self
    {
        return new self(
            $_GET,
            $_POST,
            $_FILES,
            $_SERVER
        );
    }

    /**
     * Get all input data (GET + POST)
     */
    public function all(): array
    {
        return array_merge($this->get, $this->post);
    }

    /**
     * Get input value by key
     */
    public function input(string $key, mixed $default = null): mixed
    {
        return $this->post[$key]
            ?? $this->get[$key]
            ?? $default;
    }

    /**
     * Check if input exists
     */
    public function has(string $key): bool
    {
        return isset($this->post[$key]) || isset($this->get[$key]);
    }

    /**
     * Get only specific input keys
     */
    public function only(array $keys): array
    {
        return array_intersect_key(
            $this->all(),
            array_flip($keys)
        );
    }

    /**
     * Exclude specific input keys
     */
    public function except(array $keys): array
    {
        return array_diff_key(
            $this->all(),
            array_flip($keys)
        );
    }

    /**
     * Get uploaded file
     */
    public function file(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    /**
     * Request method (GET, POST, PUT...)
     */
    public function method(): string
    {
        return strtoupper($this->server['REQUEST_METHOD'] ?? 'GET');
    }

    /**
     * Check request method
     */
    public function isMethod(string $method): bool
    {
        return $this->method() === strtoupper($method);
    }

    /**
     * Get request URI
     */
    public function uri(): string
    {
        return strtok($this->server['REQUEST_URI'] ?? '/', '?');
    }

    /**
     * Check if request is POST
     */
    public function isPost(): bool
    {
        return $this->isMethod('POST');
    }

    /**
     * Check if request is GET
     */
    public function isGet(): bool
    {
        return $this->isMethod('GET');
    }
}
```

---

# 🔗 How to use it in your controller

### **RegisterController**

```php
use App\Http\Request;

public function store(Request $request): void
{
    $this->validateCsrf();

    $data = $request->all();

    if (empty($data['email'])) {
        // handle error
    }
}
```

---

# 🧠 How the Request object is created

Your **router** should pass it automatically.

Example (simplified):

```php
$request = \App\Http\Request::capture();

$controller = new RegisterController();
$controller->store($request);
```

📌 If your router doesn’t do this yet, we can add it cleanly.

---

# 🧼 What this Request class intentionally does NOT do

❌ Validation
❌ Authorization
❌ Filtering
❌ Business rules
❌ Session handling

Those belong elsewhere.

---

# 🧩 Why this is Clean Architecture compliant

✔ Input is an infrastructure concern
✔ Controller depends on an abstraction
✔ Easy to mock for tests
✔ Easy to extend later
✔ No tight coupling to globals

---

# 🏁 Summary

You now have:

* A real `Request` object
* Clean controller method signatures
* No dependency explosion
* Laravel-like ergonomics
* Full control over your architecture

---

If you want, next I can:

👉 Modify your router to auto-inject `Request`
👉 Add request validation layer
👉 Add CSRF middleware instead of controller method
👉 Add JSON detection for API calls

Just tell me 🚀
