
# 🧩 COMPONENTE: Checkbox

---

# 📌 ¿Qué es?

El componente **Checkbox** es un input de tipo booleano reutilizable que representa una opción activable/desactivable dentro de formularios.

Se utiliza para:

* aceptar términos
* flags booleanos (activo/inactivo)
* preferencias de usuario
* filtros
* permisos simples

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Define valores por defecto
2. Detecta estado `checked`
3. Integra validación de errores automática
4. Construye atributos HTML dinámicos
5. Renderiza input tipo checkbox
6. Muestra error si existe

---

# 📦 Props disponibles

---

## 🔹 name

Nombre del input.

* Es obligatorio para formularios
* Se usa para binding con `session old input` y `errors`

---

## 🔹 id

ID del checkbox.

* Por defecto usa `name`
* Se usa para asociar label

---

## 🔹 checked

Define si el checkbox está marcado.

```text id="ch01"
true | false
```

---

## 🔹 value

Valor enviado cuando el checkbox está marcado.

Por defecto:

```text id="ch02"
1
```

---

## 🔹 class

Clases CSS del input.

* Se puede extender dinámicamente
* Si hay error, se agrega `is-invalid`

---

## 🔹 attributes

Atributos HTML adicionales dinámicos.

Ejemplo:

```php id="ch03"
[
    'disabled' => true,
    'data-role' => 'permission'
]
```

---

## 🔹 error (interno)

Se obtiene automáticamente:

```php id="ch04"
$error = errors($name);
```

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Estado de error

Si existe error:

```php id="chlogic1"
$class .= ' is-invalid';
```

Esto conecta directamente con Bootstrap validation.

---

## 2. Render del checkbox

Siempre genera:

```html id="chhtml1"
<input type="checkbox">
```

---

## 3. Estado checked

Si `$checked` es true:

```html id="chhtml2"
checked
```

---

## 4. Atributos dinámicos

Se convierten en HTML:

* boolean true → atributo simple
* string → key="value"

---

## 5. Error visual

Si hay error:

```html id="chhtml3"
<div class="invalid-feedback">
    mensaje de error
</div>
```

---

# 🖼️ HTML FINAL GENERADO

---

## 🔹 Caso normal

```html id="chhtml4"
<input type="checkbox" name="terms" id="terms" value="1">
```

---

## 🔹 Con checked

```html id="chhtml5"
<input type="checkbox" checked>
```

---

## 🔹 Con error

```html id="chhtml6"
<input class="is-invalid">

<div class="invalid-feedback">
    Este campo es obligatorio
</div>
```

---

# 🔐 SEGURIDAD

* `name` → escapado
* `id` → escapado
* `value` → escapado
* `class` → escapado
* `attributes` → escapados
* error → escapado

---

# 🧠 RESUMEN MENTAL

```text id="chsum1"
Checkbox = input booleano con estado checked + validación automática integrada
```

---

# 📌 COMPORTAMIENTO FINAL

## ✔ Estado del checkbox

* depende de `$checked`
* no depende del HTML directamente

---

## ✔ Validación automática

* usa `errors($name)`
* integra feedback visual automáticamente

---

## ✔ Extensibilidad

* atributos dinámicos permiten extender sin tocar el componente

---

# 🚀 NIVEL DEL COMPONENTE

Este componente ya está en nivel:

```text id="chlevel1"
form system core component
```

porque ya incluye:

* estado
* validación
* binding con sistema de errores
* lógica de UI reactiva (SSR)

---

# 🔥 SIGUIENTE PASO NATURAL

Este es el punto donde tu sistema empieza a evolucionar hacia:

* checkbox groups
* radio groups (ya casi lo tienes)
* form state management tipo Laravel

Si quieres, el siguiente paso lógico sería:

👉 convertir Checkbox + Input en un sistema unificado de “FormField component base”

Eso es exactamente lo que luego Blade abstrae internamente.
