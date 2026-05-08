
# 🧩 COMPONENTE: Card (con soporte de imagen)

---

# 📌 ¿Qué es?

El componente **Card** es un contenedor visual reutilizable que permite construir tarjetas de contenido estructurado con soporte opcional de imagen.

Sirve para representar:

* perfiles de usuario
* productos
* posts
* dashboards
* bloques informativos

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Define valores por defecto de props
2. Renderiza estructura base tipo card
3. Permite imagen opcional con posición configurable
4. Soporta contenido principal (slot)
5. Soporta header implícito (title dentro del body)
6. Soporta footer opcional
7. Permite atributos HTML dinámicos
8. Permite control de tamaño de imagen

---

# 📦 Props disponibles

---

## 🔹 title

Título del card.

* Se renderiza dentro del body como `<h5>`
* Es escapado con `e()`

---

## 🔹 slot

Contenido principal del card.

* Se renderiza dentro del `.card-body`
* Permite HTML libre
* Es el contenido principal del componente

---

## 🔹 footer

Contenido del pie del card.

* Se renderiza dentro de `.card-footer`
* Es escapado con `e()`

---

## 🖼️ PROPS DE IMAGEN

---

## 🔹 image

URL de la imagen del card.

```text id="cimg01"
/image/user.png
```

---

## 🔹 imageAlt

Texto alternativo de la imagen.

* Importante para accesibilidad

---

## 🔹 imagePosition

Define la posición de la imagen dentro del card.

Valores:

* `top` (default)
* `left`
* `right`

---

## 🔹 imageWidth

Define el ancho de la imagen.

Ejemplo:

```text id="cimg02"
100px
```

---

## 🔹 imageHeight

Define la altura de la imagen.

Ejemplo:

```text id="cimg03"
80px
```

---

## 🔹 id

ID opcional del contenedor raíz:

```html id="cid01"
<div id="...">
```

---

## 🔹 class

Clases CSS del card.

Por defecto:

```text id="cclass01"
card
```

---

## 🔹 attributes

Atributos HTML adicionales dinámicos.

Ejemplo:

```php id="cattr01"
[
    'data-id' => 10,
    'role' => 'article'
]
```

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Estructura base

Siempre genera:

```html id="chtml01"
<div class="card">
```

---

## 2. Imagen (según posición)

### 🔹 top

Se renderiza arriba del card:

```html id="chtml02"
<img class="card-img-top">
```

---

### 🔹 left

Se renderiza dentro del body alineado a la izquierda:

```html id="chtml03"
<img class="float-start me-3">
```

---

### 🔹 right

Se renderiza dentro del body alineado a la derecha:

```html id="chtml04"
<img class="float-end ms-3">
```

---

## 3. Body del card

Siempre existe:

```html id="chtml05"
<div class="card-body">
```

---

## 4. Título (opcional)

Si existe `title`:

```html id="chtml06"
<h5 class="card-title">Título</h5>
```

---

## 5. Contenido principal

Se renderiza dentro del body:

* proviene de `slot`
* puede incluir HTML libre

---

## 6. Footer (opcional)

Si existe:

```html id="chtml07"
<div class="card-footer">
    footer
</div>
```

---

## 7. Atributos HTML

Se convierten dinámicamente:

* boolean true → atributo simple
* string → key="value"

---

# 🖼️ ESTRUCTURA FINAL DEL COMPONENTE

---

## 🔹 Caso completo (imagen top)

```html id="chtml08"
<div class="card">

    <img class="card-img-top">

    <div class="card-body">
        <h5 class="card-title">Título</h5>

        contenido principal
    </div>

    <div class="card-footer">
        footer
    </div>

</div>
```

---

## 🔹 Caso con imagen left/right

```html id="chtml09"
<div class="card">

    <div class="card-body">

        <img class="float-start">

        contenido

    </div>

</div>
```

---

# 🔐 SEGURIDAD

* `title` → escapado con `e()`
* `footer` → escapado con `e()`
* `image`, `alt` → escapados con `e()`
* `slot` → NO escapado (HTML libre)
* atributos → escapados

---

# 🧠 RESUMEN MENTAL

```text id="csum01"
Card = contenedor visual flexible con soporte de imagen, contenido dinámico y estructura tipo layout
```

---

# 🚀 NIVEL DEL COMPONENTE

Este componente ya está en nivel:

```text id="clevel01"
mini framework UI component system
```

Porque incluye:

* layout estructurado
* soporte media (image)
* slots implícitos
* flexibilidad tipo framework real

---

Si quieres el siguiente paso natural, podemos hacer algo más avanzado:

* Card con slots nombrados (tipo Blade real)
* o sistema de componentes anidados (Card > Image > Body > Footer)
* o empezar a construir un “compiler de componentes”

Tú decides.
