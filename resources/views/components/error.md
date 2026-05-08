Este componente es bastante simple, pero en realidad es importante porque ya estás separando una pieza clave del sistema de formularios: **la visualización de errores**.

Te lo documento como manual.

---

# 🧩 COMPONENTE: Error (Field Error)

---

# 📌 ¿Qué es?

El componente **Error** es un fragmento reutilizable encargado de mostrar mensajes de validación asociados a un campo de formulario.

Se utiliza exclusivamente para:

* mostrar errores de validación
* desacoplar la UI de los inputs
* mantener consistencia en formularios

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Recibe el nombre del campo (`name`)
2. Obtiene el error desde el sistema global `errors()`
3. Si existe un mensaje:

   * lo escapa con `e()`
   * lo renderiza dentro de un contenedor Bootstrap
4. Si no existe error:

   * no renderiza nada

---

# 📦 Props disponibles

---

## 🔹 name

Nombre del campo asociado.

Ejemplo:

```text id="er01"
email
password
username
```

Este valor se usa para buscar el error:

```php id="er02"
errors($name)
```

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Obtener mensaje de error

```php id="erlogic1"
$message = errors($name);
```

* Si no existe error → null
* Si existe → string con mensaje

---

## 2. Condición de render

Solo se muestra si existe mensaje:

```php id="erlogic2"
if ($message)
```

---

## 3. Render del error

```html id="erhtml1"
<div class="invalid-feedback">
    mensaje de error
</div>
```

---

# 🖼️ SALIDA FINAL

---

## 🔹 Caso con error

```html id="erhtml2"
<div class="invalid-feedback">
    El campo email es obligatorio
</div>
```

---

## 🔹 Caso sin error

No genera absolutamente nada:

```text id="erhtml3"
// vacío
```

---

# 🔐 SEGURIDAD

* `message` se escapa con `e()`
* evita inyección de HTML en mensajes de error

---

# 🧠 RESUMEN MENTAL

```text id="ersum1"
Error Component = render condicional de mensajes de validación por campo
```

---

# 📌 COMPORTAMIENTO

## ✔ Solo muestra si hay error

* no renderiza HTML innecesario
* mantiene DOM limpio

---

## ✔ Depende del sistema global

Este componente está acoplado a:

```php id="erdep1"
errors($name)
```

que probablemente viene de session flash o validator.

---

## ✔ Integración natural con inputs

Se usa normalmente junto a inputs:

* input
* checkbox
* select

---

# 🚀 NIVEL DEL COMPONENTE

Este es un componente:

```text id="erlevel1"
UI micro-component (validation helper)
```

No es estructural como Card, sino:

* auxiliar
* reutilizable
* dependiente del sistema de validación

---

# 🔥 IMPORTANTE (ARQUITECTURA)

Este componente es el que hace que tu sistema:

✔ se sienta framework
✔ tenga consistencia en forms
✔ evite duplicación de lógica de errores

---

# 📌 SIGUIENTE PASO NATURAL

Este componente encaja perfecto con lo siguiente:

* Input refactorizado para usar `<x-error>`
* Checkbox usando `<x-error>`
* Select usando `<x-error>`

O el siguiente nivel:

👉 crear un **FormField wrapper component** que ya incluya input + label + error automáticamente

Eso es exactamente el patrón que luego Laravel Blade abstrae con components compuestos.
