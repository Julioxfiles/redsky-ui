
Perfecto, vamos **paso a paso y sin suposiciones** 👍
Asumo **Windows 10**, **Composer ya instalado** y que estás en la **raíz del proyecto UI** (donde está `composer.json`).

---

## 1️⃣ Verifica que Composer está instalado

En **CMD** o **PowerShell**, ejecuta:

```cmd
composer --version
```

Si ves algo como:

```
Composer version 2.x.x
```

✔ Composer está listo
❌ Si no, dime y te explico cómo instalarlo en Windows

---

## 2️⃣ Instala las dependencias del `composer.json`

Desde la carpeta del proyecto (donde está `composer.json`):

```cmd
composer install
```

Esto hará automáticamente:

* Crear la carpeta `vendor/`
* Descargar `vlucas/phpdotenv`
* Generar `vendor/autoload.php`

---

## 3️⃣ Cómo usar el autoload en tu proyecto

En tu **entry point** (`public/index.php`):

```php
<?php

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();
```

✔ Esto activa:

* PSR-4 (`App\`)
* helpers (`helpers/helpers.php`)

---

## 4️⃣ Verifica que PSR-4 funciona

Crea este archivo:

```text
src/Test.php
```

```php
<?php

namespace App;

class Test
{
    public static function hello()
    {
        return 'Composer funciona correctamente';
    }
}
```

Y en `public/index.php`:

```php
use App\Test;

echo Test::hello();
```

Abre el navegador o ejecuta:

```cmd
php public\index.php
```

Resultado esperado:

```
Composer funciona correctamente
```

---

## 5️⃣ Si agregas o cambias clases nuevas

Cada vez que:

* Agregues carpetas nuevas
* Cambies namespaces
* Cambies `autoload`

Ejecuta:

```cmd
composer dump-autoload
```

---

## 6️⃣ Sobre `autoload.files` (⚠️ nota importante)

```json
"files": [
  "helpers/helpers.php"
]
```

Esto significa:

* El archivo se carga **siempre**
* Las funciones son **globales**

📌 En **Clean Architecture / DDD**, esto es aceptable **solo en la UI**, no en el Domain.

✔ Para la UI está bien
❌ No lo uses en el API Domain

---

## 7️⃣ Resumen rápido (comandos clave)

```cmd
composer install
composer dump-autoload
php public\index.php
```

---

## 8️⃣ Siguiente paso recomendado

Antes de continuar, te sugiero:

* Crear `helpers/helpers.php`
* Definir funciones como `view()`, `redirect()`
* Configurar `.env`

Si quieres, en el siguiente mensaje puedo:

* Revisar tu `helpers.php`
* Ajustar el autoload para Clean Architecture
* Configurar el `ApiClient`
* Preparar un `.env.example`

Dime cómo quieres seguir 👌
