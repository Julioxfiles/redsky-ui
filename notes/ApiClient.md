Perfecto. Aquí ya estamos **en modo framework serio** 🧠⚙️
Vamos a crear un **ApiClient robusto**, inspirado en cómo lo hacen Laravel, Symfony y Guzzle, pero **sin dependencias externas** (por ahora).

Voy a dividirlo en **capas claras**, porque eso es lo que lo vuelve robusto y reutilizable.

---

# 🎯 Objetivo del ApiClient

Que desde la UI puedas hacer esto:

```php
$api = new ApiClient();

$response = $api->post('/auth/register', [
    'name' => 'Juan',
    'email' => 'juan@test.com',
    'password' => 'secret',
    'password_confirmation' => 'secret',
]);
```

Y que:

* Envíe JSON
* Maneje headers
* Maneje status codes
* Capture errores 4xx / 5xx
* Devuelva datos limpios
* Lance excepciones claras

---

# 🧱 Estructura propuesta (skynet-core)

```text
src/
└── Http/
    ├── ApiClient.php
    ├── ApiResponse.php
    └── Exceptions/
        ├── ApiException.php
        ├── ApiValidationException.php
        └── ApiServerException.php
```

Esto **NO es exagerado**:
👉 es exactamente lo que hace Laravel internamente.

---

## 1️⃣ Excepción base

📄 `src/Http/Exceptions/ApiException.php`

```php
<?php
declare(strict_types=1);

namespace Core\Http\Exceptions;

use Exception;

class ApiException extends Exception
{
    protected array $errors = [];

    public function __construct(
        string $message,
        int $code = 0,
        array $errors = []
    ) {
        parent::__construct($message, $code);
        $this->errors = $errors;
    }

    public function errors(): array
    {
        return $this->errors;
    }
}
```

---

## 2️⃣ Excepción de validación (422)

📄 `ApiValidationException.php`

```php
<?php
declare(strict_types=1);

namespace Core\Http\Exceptions;

class ApiValidationException extends ApiException
{
}
```

---

## 3️⃣ Excepción de error servidor (500+)

📄 `ApiServerException.php`

```php
<?php
declare(strict_types=1);

namespace Core\Http\Exceptions;

class ApiServerException extends ApiException
{
}
```

---

## 4️⃣ ApiResponse (envoltura elegante)

📄 `src/Http/ApiResponse.php`

```php
<?php
declare(strict_types=1);

namespace Core\Http;

class ApiResponse
{
    public function __construct(
        protected int $status,
        protected array $data
    ) {}

    public function status(): int
    {
        return $this->status;
    }

    public function data(): array
    {
        return $this->data;
    }

    public function isSuccess(): bool
    {
        return $this->status >= 200 && $this->status < 300;
    }
}
```

---

## 5️⃣ El **ApiClient robusto**

📄 `src/Http/ApiClient.php`

```php
<?php
declare(strict_types=1);

namespace Core\Http;

use Core\Http\Exceptions\ApiException;
use Core\Http\Exceptions\ApiValidationException;
use Core\Http\Exceptions\ApiServerException;

class ApiClient
{
    protected string $baseUrl;
    protected array $headers = [];

    public function __construct(?string $baseUrl = null)
    {
        $this->baseUrl = rtrim(
            $baseUrl ?? $_ENV['API_BASE_URL'] ?? 'http://skynet-api.local',
            '/'
        );

        $this->headers = [
            'Accept: application/json',
            'Content-Type: application/json',
        ];
    }

    /* =====================
       Public HTTP Methods
    ====================== */

    public function get(string $uri, array $query = []): ApiResponse
    {
        if (!empty($query)) {
            $uri .= '?' . http_build_query($query);
        }

        return $this->request('GET', $uri);
    }

    public function post(string $uri, array $data = []): ApiResponse
    {
        return $this->request('POST', $uri, $data);
    }

    public function put(string $uri, array $data = []): ApiResponse
    {
        return $this->request('PUT', $uri, $data);
    }

    public function delete(string $uri): ApiResponse
    {
        return $this->request('DELETE', $uri);
    }

    /* =====================
       Core Request Handler
    ====================== */

    protected function request(
        string $method,
        string $uri,
        array $data = []
    ): ApiResponse {
        $url = $this->baseUrl . '/' . ltrim($uri, '/');

        $ch = curl_init($url);

        $options = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => $this->headers,
        ];

        if (!empty($data)) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }

        curl_setopt_array($ch, $options);

        $rawResponse = curl_exec($ch);

        if ($rawResponse === false) {
            throw new ApiException(curl_error($ch));
        }

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($rawResponse, true) ?? [];

        return $this->handleResponse($status, $decoded);
    }

    /* =====================
       Response Handling
    ====================== */

    protected function handleResponse(int $status, array $data): ApiResponse
    {
        if ($status === 422) {
            throw new ApiValidationException(
                $data['message'] ?? 'Validation failed',
                422,
                $data['errors'] ?? []
            );
        }

        if ($status >= 500) {
            throw new ApiServerException(
                $data['message'] ?? 'Server error',
                $status
            );
        }

        if ($status >= 400) {
            throw new ApiException(
                $data['message'] ?? 'API error',
                $status
            );
        }

        return new ApiResponse($status, $data);
    }
}
```

---

# 6️⃣ Cómo lo usarás en tu `RegisterController`

```php
use Core\Http\ApiClient;
use Core\Http\Exceptions\ApiValidationException;

public function store(Request $request): void
{
    $data = $request->all();

    try {
        $api = new ApiClient();
        $api->post('/auth/register', $data);

        $_SESSION['success'] = 'Account created successfully';
        $this->redirect('/login');

    } catch (ApiValidationException $e) {
        $_SESSION['errors'] = $e->errors();
        $_SESSION['old'] = $data;
        $this->redirect('/register');
    }
}
```

---

# 🧠 Por qué esto es **robusto**

✔ Separación total UI / API
✔ Manejo profesional de errores
✔ Reutilizable en cualquier proyecto
✔ Fácil de testear
✔ Fácil de extender (auth tokens, retry, logging)

Esto **ya no es tutorial**.
Esto es **base de framework propio**.

---

## 🔜 Próximo paso recomendado

1️⃣ Añadir **Authorization Bearer Token**
2️⃣ Retry automático
3️⃣ Logging de requests
4️⃣ Tests del ApiClient
5️⃣ Middleware de autenticación en UI

Dime cuál seguimos y lo construimos con la misma calidad 💪
