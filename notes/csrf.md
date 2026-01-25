Perfecto. Vamos **directo y limpio**, **como Laravel**, sin sobre-ingeniería.

---

# 🛡️ CSRF token automático (Laravel-style)

Objetivo:

* Token automático
* Invisible para el desarrollador
* `<input type="hidden">` en formularios
* Verificación en POST
* Usa sesión
* Simple

---

## 1️⃣ Generar y guardar el token (una sola vez)

### 📄 `app/Support/Security/Csrf.php`

```php
<?php

namespace App\Support\Security;

class Csrf
{
    public static function token(): string
    {
        if (!isset($_SESSION['_csrf_token'])) {
            $_SESSION['_csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['_csrf_token'];
    }

    public static function verify(?string $token): bool
    {
        return isset($_SESSION['_csrf_token'])
            && is_string($token)
            && hash_equals($_SESSION['_csrf_token'], $token);
    }
}
```

---

## 2️⃣ Helper global `csrf_field()`

📄 `app/Support/helpers/helpers.php`

```php
use App\Support\Security\Csrf;

function csrf_field(): string
{
    $token = Csrf::token();
    return '<input type="hidden" name="_token" value="' . htmlspecialchars($token) . '">';
}
```

👉 Igual que Laravel:

```blade
@csrf
```

pero en PHP real.

---

## 3️⃣ Directiva Blade `@csrf`

En `compileDirectives()` añade:

```php
// @csrf
$value = preg_replace(
    "/@csrf/",
    "<?php echo csrf_field(); ?>",
    $value
);
```

---

## 4️⃣ Usar en la vista (automático)

```blade
<form method="POST" action="/login">
    @csrf

    <input type="email" name="email">
    <input type="password" name="password">

    <button>Login</button>
</form>
```

✔ Nada manual
✔ Siempre protegido

---

## 5️⃣ Verificar CSRF en POST (Middleware simple)

### 📄 `app/Http/Middleware/VerifyCsrfToken.php`

```php
<?php

namespace App\Http\Middleware;

use App\Support\Security\Csrf;

class VerifyCsrfToken
{
    public static function handle(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $token = $_POST['_token'] ?? null;

            if (!Csrf::verify($token)) {
                http_response_code(419);
                exit('CSRF token mismatch.');
            }
        }
    }
}
```

---

## 6️⃣ Ejecutar el middleware (front controller)

📄 `public/index.php`

```php
session_start();

use App\Http\Middleware\VerifyCsrfToken;

VerifyCsrfToken::handle();
```

👉 Exactamente como Laravel:

* `web` middleware
* antes del router

---

## 🧠 Flujo completo (Laravel real)

1. GET `/login`
2. Token se genera
3. Vista imprime `<input hidden>`
4. POST `/login`
5. Middleware valida token
6. Si falla → **419**
7. Si pasa → controlador

---

## 🏁 Resultado final

✔ Automático
✔ Seguro (`hash_equals`)
✔ Cache-friendly
✔ Laravel-style
✔ UI desacoplado de API

---

## 📌 Nota importante (API externa)

Como **usas una API REST separada**:

* CSRF **solo protege la UI**
* La API usa:

  * JWT
  * OAuth
  * Tokens Bearer
* **NO CSRF en API** (correcto)

Laravel hace exactamente eso.

---

Si quieres, el siguiente nivel natural es:

* `@method('PUT')`
* Flash messages
* Old input (`old('email')`)
* Validation errors (`$errors`)

Dime cuál seguimos 🔥

Excelente pregunta. Este **sí es el tipo de detalle que marca la diferencia**.
Te explico el **flujo real de Laravel**, paso a paso, con **quién**, **qué archivo** y **cuándo** ocurre cada cosa.

---

# 🔐 Flujo completo de CSRF en Laravel (explicado a fondo)

Voy a describir **exactamente lo que pasa en un request real**, y luego te muestro el paralelo con **tu framework**.

---

## 1️⃣ Request inicial: `GET /login`

### 🔹 Quién lo recibe

* **Servidor web** (Apache / Nginx)
* Redirige todo a:

  ```
  public/index.php
  ```

### 🔹 Qué hace `index.php`

Archivo:

```
public/index.php
```

Responsabilidades:

* Carga autoload
* Arranca sesión (`session_start`)
* Crea la aplicación
* Ejecuta el **Kernel HTTP**

En Laravel real:

```php
$app->handle($request);
```

En tu framework:

```php
session_start();
VerifyCsrfToken::handle(); // aún no valida, solo prepara
$router->dispatch(...)
```

📌 **Importante**
En este punto **NO se valida CSRF**, porque:

* El método es **GET**
* CSRF solo aplica a métodos que modifican estado

---

## 2️⃣ Se ejecuta el controlador (GET)

Ruta:

```php
Route::get('/login', [AuthController::class, 'showLoginForm']);
```

Archivo:

```
app/Http/Controllers/AuthController.php
```

Método:

```php
public function showLoginForm()
{
    view('auth.login');
}
```

Aquí el controlador:

* **NO sabe nada de CSRF**
* Solo devuelve una vista

👉 Esto es diseño limpio (Single Responsibility)

---

## 3️⃣ Renderizado de la vista

Archivo:

```
resources/views/auth/login.blade.php
```

Contenido:

```blade
<form method="POST" action="/login">
    @csrf
</form>
```

### 🔹 Qué hace `@csrf`

Durante la **compilación Blade**:

```blade
@csrf
```

se convierte en:

```php
<?php echo csrf_field(); ?>
```

---

## 4️⃣ Generación del token CSRF

### 🔹 Quién genera el token

Helper:

```php
csrf_field()
```

Clase:

```
App\Support\Security\Csrf
```

Método:

```php
Csrf::token()
```

### 🔹 Qué hace exactamente

* Verifica si ya existe `$_SESSION['_csrf_token']`
* Si NO existe:

  * Genera uno con `random_bytes`
  * Lo guarda en sesión
* Devuelve el token

📌 **Momento exacto**

> El token se genera **CUANDO la vista se renderiza**,
> **NO** antes,
> **NO** en el middleware.

---

## 5️⃣ El navegador recibe el HTML

HTML final enviado al cliente:

```html
<input type="hidden" name="_token" value="abc123...">
```

📌 El navegador:

* No sabe qué es CSRF
* Solo envía el valor de vuelta en el POST

---

## 6️⃣ Request `POST /login`

Usuario envía el formulario.

Datos enviados:

```
POST /login
_token=abc123
email=...
password=...
```

---

## 7️⃣ Middleware CSRF se ejecuta (aquí se valida)

### 🔹 Quién lo ejecuta

* **ANTES del controlador**
* En Laravel:

  ```
  app/Http/Middleware/VerifyCsrfToken.php
  ```
* En tu framework:

  ```
  VerifyCsrfToken::handle();
  ```

📌 Este es el punto **CRÍTICO**.

---

### 🔹 Qué hace el middleware

```php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['_token'] ?? null;

    if (!Csrf::verify($token)) {
        http_response_code(419);
        exit('CSRF token mismatch.');
    }
}
```

Valida:

1. ¿Existe token en sesión?
2. ¿Vino token en el POST?
3. ¿Coinciden?
4. Usa `hash_equals` (protección timing attacks)

---

## 8️⃣ Resultado de la validación

### ❌ Token inválido

* Request **termina aquí**
* Controlador **NO se ejecuta**
* Respuesta:

```
419 Page Expired
```

### ✅ Token válido

* Middleware **no hace nada**
* El request continúa
* Router despacha la ruta
* Controlador ejecuta login

---

## 9️⃣ Controlador POST

Ruta:

```php
Route::post('/login', [AuthController::class, 'login']);
```

Controlador:

```php
public function login()
{
    // Aquí CSRF ya está validado
}
```

📌 El controlador **confía** en el middleware
📌 No vuelve a validar CSRF
📌 Esto es arquitectura limpia

---

# 🧠 Resumen mental (muy importante)

| Momento       | Quién      | Archivo           |
| ------------- | ---------- | ----------------- |
| Genera token  | Vista      | `csrf_field()`    |
| Guarda token  | Sesión     | `$_SESSION`       |
| Envía token   | Browser    | HTML              |
| Valida token  | Middleware | `VerifyCsrfToken` |
| Usa resultado | Router     | continúa o corta  |

---

## 🔥 Conclusión clave

> **CSRF no es responsabilidad del controlador**
> **CSRF es responsabilidad del middleware**
> **La vista solo imprime el token**

Esto:

* Mantiene Clean Architecture
* Hace el sistema testeable
* Evita errores de seguridad

---

Si quieres, el siguiente nivel natural es:

* `@method('PUT')`
* Tokens por sesión rotativos
* Excepciones CSRF por ruta
* SPA + CSRF (SameSite cookies)

Dime qué seguimos y lo armamos.
