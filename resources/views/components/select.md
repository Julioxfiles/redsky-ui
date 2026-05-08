
# 🧩 COMPONENTE: Select

---

# 📌 ¿Qué es?

El componente **Select** es un campo de formulario que permite seleccionar uno o varios valores desde una lista dinámica de opciones.

Se utiliza para:

* catálogos (roles, países, estados)
* relaciones (categorías, tipos)
* filtros
* formularios complejos
* selección múltiple (modo avanzado)

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Normaliza opciones (`array simple o estructurado`)
2. Normaliza valores seleccionados
3. Soporta selección múltiple
4. Construye atributos dinámicos
5. Genera `<option>` dinámicamente
6. Maneja placeholder opcional
7. Escapa valores automáticamente

---

# 📦 PROPS DISPONIBLES

---

## 🔹 name

Nombre del campo.

---

## 🔹 options

Lista de opciones del select.

### Formato 1 (simple)

```php id="s01"
[
    'admin' => 'Admin',
    'user' => 'User'
]
```

---

### Formato 2 (estructurado)

```php id="s02"
[
    ['value' => 1, 'label' => 'Admin'],
    ['value' => 2, 'label' => 'User']
]
```

---

## 🔹 selected

Valor seleccionado.

Puede ser:

* string
* int
* array (multiple select)

---

## 🔹 multiple

Activa selección múltiple.

```text id="s03"
true | false
```

---

## 🔹 placeholder

Primera opción vacía.

Solo aplica si NO es múltiple.

---

## 🔹 class

Clases CSS del select.

Por defecto:

```text id="s04"
form-select
```

---

## 🔹 attributes

Atributos HTML adicionales.

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Normalización de selected

```php id="slogic1"
$selectedValues = is_array($selected) ? $selected : [$selected];
```

Esto permite:

* single select
* multiple select

---

## 2. Modo multiple

```php id="slogic2"
name="roles[]"
```

Esto activa array en backend.

---

## 3. Placeholder

Solo aparece si:

```text id="slogic3"
placeholder existe AND multiple = false
```

---

## 4. Render de opciones

El sistema soporta 2 formatos automáticamente:

### Caso A: key/value

```php id="sopt1"
'admin' => 'Admin'
```

### Caso B: objeto array

```php id="sopt2"
['value' => 1, 'label' => 'Admin']
```

---

## 5. Selección automática

```php id="slogic4"
$isSelected = in_array($value, $selectedValues);
```

---

# 🖼️ SALIDA FINAL

---

## 🔹 Select simple

```html id="shtml1"
<select name="role">

    <option value="admin">Admin</option>
    <option value="user">User</option>

</select>
```

---

## 🔹 Select con selected

```html id="shtml2"
<option value="admin" selected>Admin</option>
```

---

## 🔹 Select con placeholder

```html id="shtml3"
<option value="">Select role</option>
```

---

## 🔹 Multiple select

```html id="shtml4"
<select name="roles[]" multiple>

    <option value="admin" selected>Admin</option>
    <option value="user">User</option>

</select>
```

---

# 🔐 SEGURIDAD

✔ valores escapados con `e()`
✔ labels seguros
✔ atributos controlados
✔ evita HTML injection en options

---

# 🧠 RESUMEN MENTAL

```text id="ssum1"
Select = input dinámico basado en dataset con soporte multi-select + normalización de estructuras
```

---

# 📌 IMPORTANCIA EN TU SISTEMA

Este componente es:

✔ puente entre UI y datos
✔ base para formularios complejos
✔ equivalente a `<x-select>` en Laravel
✔ primer componente realmente “data-driven”

---

# 🚀 NIVEL DEL COMPONENTE

Este ya es:

```text id="slevel1"
advanced form component (data-driven UI primitive)
```

---

# 🔥 SIGUIENTE PASO NATURAL

Este componente abre la puerta a algo más avanzado:

👉 SelectGroup / SelectSearchable component

o incluso:

👉 Dynamic options from backend (AJAX / API-driven selects)

Ahí ya empiezas a acercarte a:

* Livewire-style behavior
* Alpine.js components
* Laravel Nova inputs

---

Si quieres, el siguiente paso lógico es el más importante de todos:

👉 crear un **FormField wrapper universal**

que unifique:

* label
* input
* select
* checkbox
* error

Eso es literalmente el corazón de Blade components en Laravel.
