
# 🧩 COMPONENTE: Input

---

# 📌 ¿Qué es?

El componente **Input** es un campo de formulario reutilizable que encapsula:

* input HTML nativo
* label opcional
* estado de valor (old input)
* validación automática
* estilos dinámicos
* soporte de atributos extendidos

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Define valores por defecto
2. Recupera valores antiguos (`old()`)
3. Obtiene errores automáticamente (`errors()`)
4. Aplica clases dinámicas si hay error
5. Renderiza label opcional
6. Renderiza input HTML
7. Muestra feedback de validación
8. Soporta atributos personalizados

---

# 📦 PROPS DISPONIBLES

---

## 🔹 type

Tipo de input.

Ejemplos:

* text
* email
* password
* number
* date
* file

---

## 🔹 name

Nombre del campo.

* clave del request
* clave del sistema de validación

---

## 🔹 id

ID del input.

* por defecto usa `name`

---

## 🔹 label

Texto del label asociado.

* opcional
* si no existe, no se renderiza

---

## 🔹 placeholder

Texto guía del input.

---

## 🔹 value

Valor del input.

Prioridad:

```text id="val01"
value prop → old(name) → ''
```

---

## 🔹 error (interno)

Se obtiene automáticamente:

```php id="err01"
errors($name)
```

---

## 🔹 class

Clases CSS base:

```text id="cls01"
form-control
```

Si hay error:

```text id="cls02"
form-control is-invalid
```

---

## 🔹 attributes

Atributos HTML adicionales.

Ejemplo:

```php id="attr01"
[
    'required' => true,
    'autocomplete' => 'email'
]
```

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Manejo de error

Si existe error:

```php id="logic01"
$class .= ' is-invalid';
```

---

## 2. Label (opcional)

```html id="html01"
<label for="id">Label</label>
```

Solo se muestra si existe `label`.

---

## 3. Input principal

```html id="html02"
<input type="text" name="email" value="..." class="form-control">
```

---

## 4. Error visual

Si existe error:

```html id="html03"
<div class="invalid-feedback">
    mensaje
</div>
```

---

## 5. Atributos dinámicos

Ejemplo:

```php id="attr02"
'required' => true
```

Se convierte en:

```html id="html04"
required
```

---

# 🧪 EJEMPLOS DE USO

---

## 🟢 1. Input básico

```php id="ex01"
<?= component('input', [
    'type' => 'text',
    'name' => 'username',
    'label' => 'Username'
]) ?>
```

---

## 🟡 2. Input con validación automática

```php id="ex02"
<?= component('input', [
    'type' => 'email',
    'name' => 'email',
    'label' => 'Email'
]) ?>
```

---

## 🔵 3. Input con atributos

```php id="ex03"
<?= component('input', [
    'type' => 'text',
    'name' => 'name',
    'attributes' => [
        'required' => true,
        'autocomplete' => 'name'
    ]
]) ?>
```

---

## 🔴 4. Input con valor manual

```php id="ex04"
<?= component('input', [
    'type' => 'text',
    'name' => 'city',
    'value' => 'Culiacán'
]) ?>
```

---

## 🟣 5. Input con error automático

Si hay error en backend:

```php id="ex05"
errors('email') = "Email inválido"
```

Renderiza automáticamente:

```html id="html05"
<input class="form-control is-invalid">

<div class="invalid-feedback">
    Email inválido
</div>
```

---

# 🔐 SEGURIDAD

✔ todo valor es escapado con `e()`
✔ atributos controlados
✔ error sanitizado
✔ evita HTML injection

---

# 🧠 RESUMEN MENTAL

```text id="sum01"
Input = campo de formulario inteligente con binding automático, validación y estado SSR
```

---

# 📌 IMPORTANCIA EN TU SISTEMA

Este componente es:

✔ base de todos los forms
✔ núcleo del sistema de UI
✔ equivalente a `<x-input>` en Laravel
✔ punto central de reutilización

---

# 🚀 NIVEL ACTUAL

Este componente ya es:

```text id="lvl01"
core form building block (framework-level primitive)
```

---

# 🔥 SIGUIENTE PASO NATURAL

El siguiente nivel lógico sería:

👉 FormField wrapper component

que combine:

* input
* label
* error
* help text

en un solo componente tipo:

```php id="next01"
component('field.input')
```

Eso es exactamente lo que Blade abstrae internamente.
