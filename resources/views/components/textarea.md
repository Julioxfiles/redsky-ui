
# 🧩 COMPONENTE: Textarea

---

# 📌 ¿Qué es?

El componente **Textarea** es un campo de formulario utilizado para introducir texto largo o multilínea.

Se utiliza para:

* comentarios
* descripciones
* contenido largo
* notas
* mensajes

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Define valores por defecto
2. Recupera `old input` automáticamente
3. Obtiene errores del sistema global
4. Aplica clases dinámicas
5. Construye atributos HTML
6. Renderiza `<textarea>`
7. Muestra errores si existen

---

# 📦 PROPS DISPONIBLES

---

## 🔹 name

Nombre del campo.

---

## 🔹 id

ID del textarea.

Por defecto:

```text id="t01"
$name
```

---

## 🔹 value

Contenido del textarea.

Prioridad:

```text id="t02"
value → old(name) → ''
```

---

## 🔹 class

Clases CSS del textarea.

Por defecto:

```text id="t03"
form-control
```

Si hay error:

```text id="t04"
form-control is-invalid
```

---

## 🔹 attributes

Atributos HTML adicionales.

Ejemplo:

```php id="t05"
[
    'rows' => 5,
    'placeholder' => 'Write here...',
    'maxlength' => 500
]
```

---

## 🔹 error (interno)

Se obtiene automáticamente:

```php id="t06"
errors($name)
```

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Manejo de error

```php id="tlogic1"
$class .= ' is-invalid';
```

---

## 2. Render del textarea

```html id="thtml1"
<textarea name="..." id="..." class="...">
    contenido
</textarea>
```

---

## 3. Valor dentro del tag

A diferencia de input:

```text id="tlogic2"
value NO es atributo
```

Se coloca dentro del contenido:

```html id="thtml2"
<textarea>contenido</textarea>
```

---

## 4. Atributos dinámicos

```php id="tlogic3"
rows, cols, placeholder, etc.
```

Se convierten en HTML automáticamente.

---

## 5. Error visual

```html id="thtml3"
<div class="invalid-feedback">
    mensaje de error
</div>
```

---

# 🧪 EJEMPLOS DE USO

---

## 🟢 1. Textarea básico

```php id="ex01"
<?= component('textarea', [
    'name' => 'description',
    'label' => 'Description'
]) ?>
```

---

## 🟡 2. Textarea con filas

```php id="ex02"
<?= component('textarea', [
    'name' => 'bio',
    'attributes' => [
        'rows' => 6
    ]
]) ?>
```

---

## 🔵 3. Textarea con placeholder

```php id="ex03"
<?= component('textarea', [
    'name' => 'message',
    'attributes' => [
        'placeholder' => 'Write your message...'
    ]
]) ?>
```

---

## 🔴 4. Textarea con valor predefinido

```php id="ex04"
<?= component('textarea', [
    'name' => 'notes',
    'value' => 'Initial text'
]) ?>
```

---

## 🟣 5. Textarea con validación automática

Si existe error:

```php id="ex05"
errors('description') = "Campo requerido"
```

Renderiza:

```html id="thtml4"
<textarea class="form-control is-invalid"></textarea>

<div class="invalid-feedback">
    Campo requerido
</div>
```

---

# 🔐 SEGURIDAD

✔ todo valor escapado con `e()`
✔ atributos controlados
✔ evita inyección HTML
✔ protege contenido del textarea

---

# 🧠 RESUMEN MENTAL

```text id="tsum1"
Textarea = input multilínea con binding automático + validación integrada + soporte de atributos dinámicos
```

---

# 📌 IMPORTANCIA EN TU SISTEMA

Este componente es:

✔ base de inputs largos
✔ complemento del Input estándar
✔ esencial para forms reales
✔ parte del core de UX en formularios

---

# 🚀 NIVEL DEL COMPONENTE

Este es:

```text id="tlevel1"
core form input primitive (multiline variant)
```

---

# 🔥 SIGUIENTE PASO NATURAL

Con esto ya tienes el set completo básico:

* Input
* Textarea
* Select
* Checkbox
* Radio
* Label
* Error
* Form

El siguiente nivel real es:

👉 FormField wrapper component

que unifique todo esto en algo como:

```php id="next1"
component('field', [
    'type' => 'textarea',
    'name' => 'description'
])
```

Ahí tu sistema empieza a parecer Blade + Laravel real.
