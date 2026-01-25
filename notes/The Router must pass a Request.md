Great, thanks for sharing the router — it’s clean and readable 👍
You’re actually **very close**. You don’t need to rewrite it; you just need to **inject the new `Request` object at the right point**.

I’ll explain:

1. **What is missing**
2. **What should change conceptually**
3. **Minimal, safe changes to your Router**
4. **Why this design is correct**

No breaking changes, no framework magic.

---

## 1️⃣ What is missing right now

Your router currently calls actions like this:

```php
(new $class)->$method();
```

or:

```php
call_user_func($action);
```

But now your controller expects:

```php
public function store(Request $request): void
```

So PHP will throw:

> Too few arguments to function store()

👉 The router must **create and pass a `Request` instance**.

---

## 2️⃣ Conceptual rule (important)

> **The Router is responsible for creating the Request**

Why?

* Router = HTTP infrastructure
* Request = HTTP data
* Controller = coordinator

✔ Clean Architecture
✔ No globals in controllers
✔ Testable

---

## 3️⃣ Minimal changes required

### ✅ Step 1: Import the Request class

At the top of your `Router.php`:

```php
use App\Http\Request;
```

---

### ✅ Step 2: Create the Request once in `dispatch()`

Modify `dispatch()` slightly:

```php
public function dispatch(string $method, string $uri): void
{
    $uri = parse_url($uri, PHP_URL_PATH);

    if (defined('BASE_URI')) {
        if (str_starts_with($uri, BASE_URI)) {
            $uri = substr($uri, strlen(BASE_URI));
        }
    }

    $uri = rtrim($uri, '/') ?: '/';

    // 🔹 Create Request object once
    $request = Request::capture();

    foreach ($this->routes as $route) {
        if ($route->method === $method && $route->uri === $uri) {
            $this->runAction($route->action, $request);
            return;
        }
    }

    http_response_code(404);
    echo '404 Not Found';
}
```

---

### ✅ Step 3: Pass Request into `runAction()`

Update method signature:

```php
protected function runAction($action, Request $request): void
```

---

### ✅ Step 4: Inject Request only when needed

Here is the **final, safe version** of `runAction()`:

```php
protected function runAction($action, Request $request): void
{
    if (is_callable($action)) {
        $action($request);
        return;
    }

    if (is_array($action)) {
        [$class, $method] = $action;

        $controller = new $class;

        // 🔹 If controller method expects Request, pass it
        $reflection = new \ReflectionMethod($controller, $method);

        if ($reflection->getNumberOfParameters() > 0) {
            $controller->$method($request);
        } else {
            $controller->$method();
        }

        return;
    }

    throw new \Exception('Invalid route action');
}
```

---

## 4️⃣ Why this design is GOOD

### ✔ Backward compatible

Controllers like this still work:

```php
public function showLoginForm(): void
```

No Request required → no error.

---

### ✔ Forward compatible

Controllers like this now work:

```php
public function store(Request $request): void
```

Request injected cleanly.

---

### ✔ Clean Architecture respected

* Router knows about HTTP
* Controller does NOT touch globals
* Request encapsulates input
* No service container
* No hidden magic

---

## 5️⃣ Example: RegisterController (now valid)

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

✔ Works
✔ Clean
✔ Testable

---

## 6️⃣ What we intentionally did NOT do

❌ No auto-binding container
❌ No parameter name guessing
❌ No middleware pipeline
❌ No annotations

This keeps **skynet-ui lightweight and explicit**.

---

## 7️⃣ Optional improvement (later)

Later you can simplify with:

* Route-level middleware
* Typed dependency injection
* Validation layer

But **right now**, this is the correct level.

---

## ✅ Final checklist

✔ Router creates Request
✔ Router injects Request safely
✔ Old controllers still work
✔ New controllers work
✔ No breaking changes

---

If you want, next we can:

👉 Move CSRF validation to router middleware
👉 Add named routes + redirect by name
👉 Add `abort(403)` / `abort(404)` helpers
👉 Add `JsonResponse` for API-like UI calls

Just tell me what’s next 🚀
