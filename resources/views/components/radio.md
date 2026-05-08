
# 🧩 COMPONENTE: Radio

---

# 📌 ¿Qué es?

El componente **Radio** es un input de tipo `radio` que permite seleccionar **una sola opción dentro de un grupo**.

Se utiliza para:

* opciones exclusivas
* formularios con decisiones únicas
* selección de categorías
* preferencias

---

# ⚙️ ¿Qué hace internamente?

Este componente:

1. Define valores por defecto
2. Permite marcar estado `checked`
3. Construye atributos dinámicos
4. Integra validación automática
5. Renderiza input radio HTML
6. Muestra error si existe

---

# 📦 PROPS DISPONIBLES

---

## 🔹 name

Nombre del grupo de radios.

⚠️ IMPORTANTE:

Todos los radios con el mismo `name` forman un grupo exclusivo.

---

## 🔹 id

ID único del radio input.

Por defecto:

```text id="r01"
$name
```

---

## 🔹 value

Valor que representa esta opción.

Ejemplo:

```text id="r02"
admin
user
guest
```

---

## 🔹 checked

Define si este radio está seleccionado.

```text id="r03"
true | false
```

---

## 🔹 class

Clases CSS del input.

Si hay error:

```text id="r04"
is-invalid
```

---

## 🔹 attributes

Atributos HTML adicionales dinámicos.

Ejemplo:

```php id="r05"
[
    'data-role' => 'option',
    'disabled' => true
]
```

---

## 🔹 error (interno)

Se obtiene automáticamente:

```php id="r06"
errors($name)
```

---

# 🧠 LÓGICA DE RENDERIZADO

---

## 1. Estado de error

Si existe error:

```php id="rlogic1"
$class .= ' is-invalid';
```

---

## 2. Render del radio

```html id="rhtml1"
<input type="radio">
```

---

## 3. Agrupación por name

```html id="rhtml2"
name="role"
```

Todos los radios con el mismo `name` forman grupo exclusivo.

---

## 4. Estado checked

```html id="rhtml3"
checked
```

Solo uno del grupo debería tenerlo.

---

## 5. Error visual

```html id="rhtml4"
<div class="invalid-feedback">
    mensaje
</div>
```

---

# 🧪 EJEMPLOS DE USO

---

## 🟢 1. Radio básico

```php id="ex01"
<?= component('radio', [
    'name' => 'role',
    'value' => 'user'
]) ?>
```

---

## 🟡 2. Grupo de radios

```php id="ex02"
<?= component('radio', [
    'name' => 'role',
    'value' => 'admin'
]) ?>

<?= component('radio', [
    'name' => 'role',
    'value' => 'user'
]) ?>
```

---

## 🔵 3. Radio con checked

```php id="ex03"
<?= component('radio', [
    'name' => 'role',
    'value' => 'admin',
    'checked' => true
]) ?>
```

---

## 🔴 4. Radio con atributos

```php id="ex04"
<?= component('radio', [
    'name' => 'role',
    'value' => 'guest',
    'attributes' => [
        'disabled' => true
    ]
]) ?>
```

---

## 🟣 5. Radio con error automático

Si existe:

```php id="ex05"
errors('role') = "Selecciona un rol"
```

Renderiza:

```html id="rhtml5"
<input class="is-invalid">

<div class="invalid-feedback">
    Selecciona un rol
</div>
```

---

# 🔐 SEGURIDAD

✔ valores escapados con `e()`
✔ atributos seguros
✔ error sanitizado
✔ evita inyección HTML

---

# 🧠 RESUMEN MENTAL

```text id="rsum1"
Radio = input de selección exclusiva dentro de un grupo con validación automática
```

---

# 📌 DIFERENCIA CLAVE CON CHECKBOX

---

## ✔ Checkbox

```text id="diff1"
multi-selección (true/false independientes)
```

## ✔ Radio

```text id="diff2"
selección única dentro de grupo
```

---

# 🚀 NIVEL DEL COMPONENTE

Este componente es:

```text id="rlevel1"
form input primitive con lógica de grupo
```

---

# 🔥 SIGUIENTE PASO NATURAL

Este es el momento donde tu sistema ya está listo para evolucionar hacia:

👉 RadioGroup component (muy importante)

que permitiría:

* definir opciones en array
* render automático de múltiples radios
* manejo tipo Laravel:

```php id="next1"
component('radio-group', [
    'name' => 'role',
    'options' => [
        'admin' => 'Admin',
        'user' => 'User'
    ]
])
```

Ahí ya estás entrando en nivel Blade + Form components avanzados.
