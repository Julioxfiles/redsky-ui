¡Perfecto! 😎 Tu `ApiResponse` ya tiene lo básico (`status()`, `data()`, `isSuccess()`), solo le faltan un par de **helpers útiles** para integrarse bien con tu UI y `ApiClient`.

Aquí te propongo la versión **complementada y lista para usar**:

```php
<?php
declare(strict_types=1);

namespace Core\Http\Client;

class ApiResponse
{
    public function __construct(
        protected int $status,
        protected array $data
    ) {}

    /**
     * Código HTTP de la respuesta
     */
    public function status(): int
    {
        return $this->status;
    }

    /**
     * Retorna todos los datos decodificados de la respuesta
     */
    public function data(): array
    {
        return $this->data;
    }

    /**
     * Indica si la respuesta fue exitosa (HTTP 2xx)
     */
    public function isSuccess(): bool
    {
        return $this->status >= 200 && $this->status < 300;
    }

    /**
     * Retorna errores de validación, si existen
     */
    public function errors(): array
    {
        return $this->data['errors'] ?? [];
    }

    /**
     * Retorna el mensaje general de la respuesta, si existe
     */
    public function message(): string
    {
        return $this->data['message'] ?? '';
    }

    /**
     * Extrae un campo específico de la respuesta, o valor por defecto
     */
    public function get(string $key, mixed $default = null): mixed
    {
        return $this->data[$key] ?? $default;
    }
}
```

---

### ✅ Ventajas de esta versión

1. Puedes usarlo directamente en controladores:

```php
$response = $api->post('/auth/register', $data);

if ($response->isSuccess()) {
    $_SESSION['success'] = $response->message() ?: 'Registro exitoso';
} else {
    $_SESSION['errors'] = $response->errors();
}
```

2. Facilita migrar entre diferentes endpoints de la API.
3. Separación clara entre:

   * `ApiClient` → envío/recepción de requests
   * `ApiResponse` → interpretación de los datos recibidos

---

Si quieres, el siguiente paso sería **actualizar tu `RegisterController`** para usar **completamente `ApiClient` y `ApiResponse`**, mostrando errores de validación y mensajes de éxito de forma elegante en la UI.

¿Quieres que haga esa integración ahora?
