
# 🧩 COMPONENTE: Label

---

# 📌 ¿Qué es?

El componente **Label** es un elemento reutilizable que representa la etiqueta asociada a un campo de formulario.

Se utiliza para:

* mejorar accesibilidad (screen readers)
* asociar texto a inputs
* mejorar UX visual
* mantener consistencia en formularios

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Recibe el atributo `for`
2. Recibe el texto del label
3. Aplica clases CSS por defecto
4. Renderiza un `<label>` HTML seguro
5. Escapa automáticamente los valores

---

# 📦 PROPS DISPONIBLES

---

## 🔹 for

ID del input al que está asociado el label.

Ejemplo:

```text id="l01"
email
password
username
```

Se convierte en:

```html id="l02"
<label for="email">
```

---

## 🔹 text

Texto visible del label.

Ejemplo:

```text id="l03"
Email address
Password
Full name
```

---

## 🔹 class

Clases CSS del label.

Por defecto:

```text id="l04"
form-label
```

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Generación del label

Siempre genera:

```html id="lhtml01"
<label for="...">Texto</label>
```

---

## 2. Asociación con input

El atributo `for` conecta con:

```html id="lhtml02"
<input id="email">
```

Esto permite:

* click en label → focus input
* accesibilidad automática

---

## 3. Escapado de seguridad

Todo valor pasa por:

```php id="llogic01"
e($for)
e($text)
e($class)
```

---

# 🧪 EJEMPLOS DE USO

---

## 🟢 1. Label básico

```php id="ex01"
<?= component('label', [
    'for' => 'email',
    'text' => 'Email address'
]) ?>
```

---

## 🟡 2. Label con clase personalizada

```php id="ex02"
<?= component('label', [
    'for' => 'password',
    'text' => 'Password',
    'class' => 'form-label fw-bold'
]) ?>
```

---

## 🔵 3. Label para input requerido

```php id="ex03"
<?= component('label', [
    'for' => 'username',
    'text' => 'Username *'
]) ?>
```

---

## 🔴 4. Label para checkbox

```php id="ex04"
<?= component('label', [
    'for' => 'terms',
    'text' => 'Accept terms and conditions'
]) ?>
```

---

## 🟣 5. Label con estilos custom

```php id="ex05"
<?= component('label', [
    'for' => 'email',
    'text' => 'Email',
    'class' => 'form-label text-primary'
]) ?>
```

---

# 🔐 SEGURIDAD

✔ `for` escapado
✔ `text` escapado
✔ `class` escapado
✔ evita inyección HTML

---

# 🧠 RESUMEN MENTAL

```text id="lsum01"
Label = vínculo semántico entre texto visible y campo de formulario
```

---

# 📌 IMPORTANCIA EN TU SISTEMA

Este componente es:

✔ base de accesibilidad
✔ mejora UX sin lógica compleja
✔ componente fundamental de formularios
✔ parte de estructura estándar HTML

---

# 🚀 NIVEL DEL COMPONENTE

Este es un:

```text id="llevel01"
UI atomic component (building block)
```

No tiene lógica compleja, pero es esencial para composición de:

* Input
* Checkbox
* Select
* FormField (nivel superior)

---

# 🔥 SIGUIENTE PASO NATURAL

Este componente encaja perfecto con el siguiente nivel que estás construyendo:

👉 FormField wrapper component

que combine:

* Label
* Input
* Error

en una sola abstracción tipo framework real.

Ahí es donde tu sistema empieza a parecer Blade de verdad.
