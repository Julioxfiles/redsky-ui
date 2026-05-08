
# 🧩 COMPONENTE: Button

---

# 📌 ¿Qué es?

El componente **Button** es un componente de UI reutilizable que renderiza un botón HTML `<button>`.

Se usa para acciones de usuario como:

* enviar formularios
* ejecutar acciones
* cancelar operaciones
* disparar eventos en UI

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Define valores por defecto
2. Construye atributos HTML dinámicos
3. Resuelve contenido (slot o text)
4. Escapa valores críticos (type, id, class, text)
5. Renderiza un `<button>` final

---

# 📦 Props disponibles

---

## 🔹 type

Define el tipo del botón HTML.

Valores comunes:

* `button` (default)
* `submit`
* `reset`

Si no se define:

```text id="btype01"
button
```

---

## 🔹 text

Texto del botón (fallback).

* Se usa si no existe `slot`
* Es escapado con `e()`

---

## 🔹 slot

Contenido HTML interno del botón.

* Tiene prioridad sobre `text`
* Permite HTML libre

---

## 🔹 id

ID opcional del botón:

```html id="bid01"
id="..."
```

---

## 🔹 class

Clases CSS del botón.

Por defecto:

```text id="bclass01"
btn
```

---

## 🔹 attributes

Atributos HTML adicionales.

Ejemplo conceptual:

```php id="bat01"
[
    'disabled' => true,
    'data-id' => 5,
    'onclick' => "alert('click')"
]
```

---

# 🧠 Lógica de renderizado

---

## 1. Tipo del botón

```php id="blogic1"
type="<?= e($type) ?>"
```

Siempre se escapa.

---

## 2. ID opcional

Solo se imprime si existe:

```php id="blogic2"
$id ? 'id="..."' : ''
```

---

## 3. Clase CSS

```php id="blogic3"
class="<?= e($class) ?>"
```

---

## 4. Atributos dinámicos

Se convierten en string HTML:

* boolean true → atributo simple
* string → key="value"

---

## 5. Contenido del botón

Regla de prioridad:

```text id="bcontent1"
slot > text
```

Código:

```php id="bcontent2"
$content = $slot ?? e($text);
```

---

# 🖼️ HTML que genera

Siempre genera un botón HTML:

```html id="bhtml01"
<button>
    contenido
</button>
```

---

## Ejemplo de salida completa

### Con todo definido:

```html id="bhtml02"
<button type="submit" id="saveBtn" class="btn btn-primary" data-id="10">
    Save
</button>
```

---

# 🔐 Seguridad

* `type` se escapa
* `class` se escapa
* `text` se escapa
* `slot` NO se escapa (permite HTML)

---

# 🧠 Resumen mental

Este componente es:

```text id="bsum01"
Button = elemento de acción reutilizable con soporte de texto o HTML dinámico
```

---

# 📌 Comportamiento final

## Prioridad de contenido:

1. `slot` (HTML libre)
2. `text` (texto seguro escapado)

---

## Prioridad estructural:

* type → define comportamiento del botón
* class → estilo visual
* attributes → extensibilidad HTML

---

# 🚀 Resultado

El componente siempre produce:

```html id="bfinal01"
<button type="...">
    contenido
</button>
```

---

