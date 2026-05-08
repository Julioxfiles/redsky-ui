
# 🧩 COMPONENTE: Form (Manual completo)

---

# 📌 ¿Qué es?

El componente **Form** es el contenedor principal para formularios en tu framework. Maneja:

* envío de datos HTTP
* CSRF automático
* métodos extendidos (PUT, PATCH, DELETE)
* contenido dinámico (slot)
* subida de archivos (opcional)

---

# ⚙️ ¿Qué hace internamente?

El Form:

1. Normaliza el método HTTP
2. Agrega CSRF automáticamente
3. Soporta métodos simulados con `_method`
4. Permite atributos HTML dinámicos
5. Renderiza inputs dentro del slot
6. Puede activar uploads con `enctype`

---

# 📦 PROPS PRINCIPALES

* `action` → URL del formulario
* `method` → GET | POST | PUT | PATCH | DELETE
* `class` → clases CSS
* `attributes` → atributos HTML extra
* `slot` → contenido del formulario

---

# 🧠 REGLA CLAVE

## ✔ HTML solo soporta:

* GET
* POST

## ✔ Otros métodos se simulan con:

```text id="m01"
<input type="hidden" name="_method" value="PUT">
```

---

# 🔐 CSRF AUTOMÁTICO

Siempre incluye:

```html id="csrf01"
<input type="hidden" name="_token" value="...">
```

---

# 🧪 EJEMPLOS DE USO

---

# 🟢 1. FORM SIN ARCHIVOS (CASO NORMAL)

## 📌 Ejemplo login

```php id="ex01"
<?= component('form', [
    'action' => '/login',
    'method' => 'POST'
]) ?>

    <?= component('input', [
        'type' => 'email',
        'name' => 'email',
        'label' => 'Email'
    ]) ?>

    <?= component('input', [
        'type' => 'password',
        'name' => 'password',
        'label' => 'Password'
    ]) ?>

    <?= component('button', [
        'type' => 'submit',
        'text' => 'Login'
    ]) ?>

<?= component('form_end') ?>
```

---

## 🧾 Resultado HTML

```html id="html01"
<form method="POST" action="/login">

    <input type="hidden" name="_token" value="...">

    <input type="email">
    <input type="password">

    <button>Login</button>

</form>
```

---

# 🟡 2. FORM CON SUBIDA DE ARCHIVOS / IMÁGENES

---

## 📌 Requisito clave

```text id="req01"
enctype="multipart/form-data"
```

---

## 📌 Ejemplo upload de imagen

```php id="ex02"
<?= component('form', [
    'action' => '/upload',
    'method' => 'POST',
    'attributes' => [
        'enctype' => 'multipart/form-data'
    ]
]) ?>

    <?= component('input', [
        'type' => 'file',
        'name' => 'image',
        'label' => 'Selecciona imagen',
        'attributes' => [
            'accept' => 'image/*'
        ]
    ]) ?>

    <?= component('button', [
        'type' => 'submit',
        'text' => 'Subir imagen'
    ]) ?>

<?= component('form_end') ?>
```

---

## 🧾 Resultado HTML

```html id="html02"
<form method="POST" action="/upload" enctype="multipart/form-data">

    <input type="hidden" name="_token" value="...">

    <input type="file" name="image" accept="image/*">

    <button>Subir imagen</button>

</form>
```

---

# 📤 RESULTADO EN BACKEND

---

## ✔ Form normal

```php id="back01"
$request->input('email');
$request->input('password');
```

---

## ✔ Form con archivos

```php id="back02"
$_FILES['image']
```

Contiene:

* name
* type
* tmp_name
* size
* error

---

# ⚠️ REGLAS IMPORTANTES

---

## ❌ Sin enctype

```text id="err01"
$_FILES estará vacío
```

---

## ❌ File input sin type=file

```text id="err02"
no se activa subida
```

---

## ✔ Siempre que uses archivos:

Debes incluir:

```text id="rule01"
enctype="multipart/form-data"
```

---

# 🧠 RESUMEN MENTAL

```text id="sum01"
Form = contenedor HTTP seguro + CSRF + soporte de métodos extendidos + opcional soporte de archivos con multipart
```

---

# 🚀 CONCLUSIÓN

✔ Tu Form ya soporta todo el flujo de formularios
✔ Soporta uploads correctamente
✔ Solo requiere `enctype` manual
✔ Funciona igual que frameworks como Laravel en nivel base

---

Si quieres, el siguiente paso natural es subir un nivel importante:

👉 crear un **FileUploadService** (manejo de imágenes profesional: rename, storage, validación, etc.)

Ahí tu framework empieza a parecer uno real de producción.
