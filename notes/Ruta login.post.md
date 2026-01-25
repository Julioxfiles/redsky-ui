
## La ruta login.post
---

## 🔑 Punto clave (respuesta corta)

👉 **Sí**, `login.post` conceptualmente apunta a un **POST**
👉 **NO**, en un **UI project** ese POST **NO debería contener lógica de negocio**
👉 **SÍ**, ese POST **debe llamar a tu API REST**

**Tu intuición es correcta.**

---

## 🧱 Separación correcta de responsabilidades

Tú tienes **dos proyectos**:

### 1️⃣ API (Clean Architecture estricta)

* Auth
* Login
* Tokens
* Usuarios
* Reglas de negocio

### 2️⃣ UI (este proyecto)

* Formularios
* Vistas
* Cookies / sesión
* Redirecciones
* Llamadas HTTP a la API

👉 **El UI NO valida credenciales**
👉 **El UI NO sabe cómo se autentica un usuario**
👉 **El UI SOLO habla con la API**

Eso es **arquitectura limpia real**.

---

## 🔍 Entonces… ¿qué es `login.post` aquí?

En el **UI**, `login.post` es:

> “Un endpoint intermedio que recibe el formulario y llama a la API”

No más.

---

## 🧩 Flujo correcto (Laravel-style + Clean)

```
Browser
  ↓ POST /login
UI Controller
  ↓ HTTP POST
API /auth/login
  ↓ JSON response
UI Controller
  ↓ redirect / session
Browser
```

---

## 📌 Cómo debe verse tu ruta UI

```php
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
```

✔ Mismo URI
✔ Distinto método
✔ Exactamente como Laravel

---

## 🧠 Qué hace cada método del controlador

### `showLoginForm()`

✔ Renderiza vista
✔ Nada más

```php
public function showLoginForm(): void
{
    view('auth.login');
}
```

---

### `login()` (POST del UI)

❗ **NO valida usuarios**
❗ **NO consulta base de datos**

✔ Llama a la API

```php
public function login(): void
{
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $response = $this->apiLogin($email, $password);

    if ($response['success']) {
        $_SESSION['token'] = $response['token'];
        redirect('/dashboard');
    }

    redirect('/login?error=1');
}
```

---

## 🌐 Llamada real a la API (ejemplo simple)

```php
private function apiLogin(string $email, string $password): array
{
    $ch = curl_init('http://api.local/auth/login');

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode([
            'email' => $email,
            'password' => $password
        ])
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}
```

👉 Esto **pertenece al UI**, no a la API.

---

## 🧠 ¿Podrías llamar a la API directamente desde el formulario?

❌ **NO**
Nunca hagas esto:

```html
<form action="http://api.local/login">
```

Razones:

* CORS
* Seguridad
* UX
* CSRF
* Control de sesión

👉 El **UI siempre es el intermediario**

---

## 🧱 Clean Architecture: regla clara

| Capa          | Puede hacer          |
| ------------- | -------------------- |
| UI Controller | Llamar APIs          |
| UI Controller | Manejar sesión       |
| UI Controller | Redirigir            |
| UI Controller | Renderizar           |
| UI Controller | ❌ Regla de negocio   |
| UI Controller | ❌ Autenticación real |

---

## 🟢 Entonces, ¿por qué antes fallaba?

Porque usabas:

```php
route('login.post')
```

pero **esa ruta no existía**, o no coincidía con el método.

En UI:

* `login` → GET
* `login.post` → POST

Y el formulario debe apuntar **solo a la ruta POST existente**.

---

## 🧠 Conclusión definitiva

✔ `login.post` **sí** es correcto conceptualmente
✔ En UI **solo es un proxy hacia la API**
✔ Tu arquitectura es **la correcta**
✔ Estás replicando **Laravel + Clean Architecture real**

---

Si quieres, el próximo paso lógico es:

* CSRF token
* manejo de errores de API
* middleware de auth UI
* o HttpClient reusable (tipo Guzzle-lite)

Dime qué seguimos 🔥
