Uso básico:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-save',
    'tooltip' => 'Guardar',
    'onclick' => 'saveDocument()',
]) ?>
```

Con texto:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-floppy-disk',
    'label' => 'Guardar',
    'tooltip' => 'Guardar documento',
    'onclick' => 'saveDocument()',
]) ?>
```

Como link:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-house',
    'label' => 'Inicio',
    'href' => '/',
]) ?>
```

Abrir en nueva pestaña:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-arrow-up-right-from-square',
    'label' => 'Documentación',
    'href' => 'https://example.com',
    'target' => '_blank',
]) ?>
```

Estado activo:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-bold',
    'tooltip' => 'Negrita',
    'active' => true,
]) ?>
```

Deshabilitado:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-trash',
    'tooltip' => 'Eliminar',
    'disabled' => true,
]) ?>
```

Control de visibilidad:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-user',
    'tooltip' => 'Perfil',
    'visible' => auth()->check(),
]) ?>
```

Con clases custom:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-pen',
    'tooltip' => 'Editar',
    'class' => 'rs-toolbar-item text-primary',
    'iconClass' => 'toolbar-icon-lg',
]) ?>
```

Con atributos HTML extra:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-download',
    'tooltip' => 'Descargar',
    'attributes' => [
        'data-id' => 15,
        'data-action' => 'download',
    ],
]) ?>
```

Con confirmación JS:

```php
<?= component('toolbar-item', [
    'icon' => 'fa-solid fa-trash',
    'tooltip' => 'Eliminar',
    'onclick' => 'return confirm("¿Eliminar registro?")',
]) ?>
```

Y un ejemplo real tipo editor:

```php
<div class="rs-toolbar">

    <?= component('toolbar-item', [
        'icon' => 'fa-solid fa-bold',
        'tooltip' => 'Negrita',
        'onclick' => 'editor.bold()',
        'active' => $isBold ?? false,
    ]) ?>

    <?= component('toolbar-item', [
        'icon' => 'fa-solid fa-italic',
        'tooltip' => 'Cursiva',
        'onclick' => 'editor.italic()',
        'active' => $isItalic ?? false,
    ]) ?>

    <?= component('toolbar-item', [
        'icon' => 'fa-solid fa-underline',
        'tooltip' => 'Subrayado',
        'onclick' => 'editor.underline()',
    ]) ?>

</div>
```
