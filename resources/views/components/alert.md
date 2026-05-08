
# 🧩 COMPONENTE: Alert

---

# 📌 ¿Qué es?

El componente **Alert** es un componente de UI reutilizable que renderiza un mensaje visual en pantalla utilizando estilos tipo Bootstrap.

Se usa para mostrar:

* mensajes de éxito
* errores
* advertencias
* información general
* contenido HTML personalizado

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Define valores por defecto para sus props
2. Construye clases CSS dinámicas
3. Escapa el contenido para evitar XSS (en message)
4. Permite atributos HTML adicionales
5. Decide el contenido final (slot o message)
6. Renderiza un `<div>` final

---

# 📦 Props disponibles

## 🔹 type

Define el estilo visual del alert.

Valores válidos:

* `success`
* `danger`
* `warning`
* `info`

Si no se define, por defecto es:

```text
info
```

---

## 🔹 message

Texto plano del mensaje.

* Es escapado con `e()`
* Se usa si no existe `slot`

---

## 🔹 slot

Contenido HTML personalizado.

* Tiene prioridad sobre `message`
* No se escapa (permite HTML)

---

## 🔹 id

ID opcional del elemento HTML.

Si se define:

```html
id="..."
```

Si no, no se renderiza.

---

## 🔹 class

Clase CSS personalizada.

Por defecto:

```text
alert alert-{type}
```

---

## 🔹 attributes

Array de atributos HTML adicionales.

Ejemplo conceptual:

```php
[
    'role' => 'alert',
    'data-id' => 10,
    'disabled' => true
]
```

---

# 🧠 Lógica de renderizado

## 1. Clase CSS

```php
$class = "alert alert-{$type}";
```

---

## 2. Contenido final

```php
$content = $slot ?? e($message);
```

* Si existe slot → se usa slot
* Si no → se usa message escapado

---

## 3. Atributos HTML

Se convierten a string:

* boolean true → atributo suelto
* string/valor → key="value"

---

# 🖼️ HTML que genera

El componente siempre genera:

```html
<div>
    contenido
</div>
```

con variaciones:

### Si id existe

```html
<div id="...">
```

### Si class existe

```html
<div class="alert alert-info">
```

### Si attributes existen

```html
<div role="alert" data-id="10">
```

---

# 🔐 Seguridad

* `message` se escapa con `e()` (evita XSS)
* `slot` NO se escapa (permite HTML controlado)

---

# 📌 Comportamiento final

## Prioridad de contenido:

1. `slot` (HTML libre)
2. `message` (texto seguro escapado)

---

## Prioridad de estilo:

1. `class` personalizada (si se sobreescribe)
2. default: `alert alert-{type}`

---

# 🧩 Resultado final del componente

El output siempre es:

```html
<div class="alert alert-info">
    mensaje o HTML
</div>
```

con posibles atributos adicionales.

---

# 🧠 Resumen mental

Este componente es:

```text
Alert = wrapper visual para mensajes del sistema con soporte de HTML y seguridad básica
```

---
