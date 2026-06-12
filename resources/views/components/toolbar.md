Uso básico:

```php
<?= component('toolbar', [
    'items' => [

        [
            'icon' => 'fa-solid fa-save',
            'tooltip' => 'Guardar',
            'onclick' => 'saveDocument()',
        ],

        [
            'icon' => 'fa-solid fa-trash',
            'tooltip' => 'Eliminar',
            'onclick' => 'deleteItem()',
        ],

    ]
]) ?>
```

Toolbar con labels:

```php
<?= component('toolbar', [
    'items' => [

        [
            'icon' => 'fa-solid fa-floppy-disk',
            'label' => 'Guardar',
            'tooltip' => 'Guardar documento',
            'onclick' => 'saveDocument()',
        ],

        [
            'icon' => 'fa-solid fa-pen',
            'label' => 'Editar',
            'tooltip' => 'Editar registro',
            'onclick' => 'editItem()',
        ],

    ]
]) ?>
```

Toolbar vertical:

```php
<?= component('toolbar', [
    'vertical' => true,

    'items' => [

        [
            'icon' => 'fa-solid fa-house',
            'tooltip' => 'Inicio',
            'href' => '/',
        ],

        [
            'icon' => 'fa-solid fa-gear',
            'tooltip' => 'Configuración',
            'href' => '/settings',
        ],

    ]
]) ?>
```

Toolbar fija arriba:

```php
<?= component('toolbar', [
    'fixed' => true,
    'position' => 'top',

    'items' => [

        [
            'icon' => 'fa-solid fa-bars',
            'tooltip' => 'Menú',
        ],

        [
            'icon' => 'fa-solid fa-user',
            'tooltip' => 'Perfil',
        ],

    ]
]) ?>
```

Toolbar fija abajo:

```php
<?= component('toolbar', [
    'fixed' => true,
    'position' => 'bottom',

    'items' => [

        [
            'icon' => 'fa-solid fa-house',
            'tooltip' => 'Inicio',
        ],

        [
            'icon' => 'fa-solid fa-bell',
            'tooltip' => 'Notificaciones',
        ],

    ]
]) ?>
```

Con color global:

```php
<?= component('toolbar', [

    'background' => '#1e293b',
    'color' => '#ffffff',

    'items' => [

        [
            'icon' => 'fa-solid fa-save',
            'tooltip' => 'Guardar',
        ],

        [
            'icon' => 'fa-solid fa-download',
            'tooltip' => 'Descargar',
        ],

    ]
]) ?>
```

Con estilos visuales:

```php
<?= component('toolbar', [

    'rounded' => true,
    'shadow' => true,
    'gap' => '1rem',

    'items' => [

        [
            'icon' => 'fa-solid fa-play',
            'tooltip' => 'Ejecutar',
        ],

        [
            'icon' => 'fa-solid fa-stop',
            'tooltip' => 'Detener',
        ],

    ]
]) ?>
```

Con clase global para items:

```php
<?= component('toolbar', [

    'itemClass' => 'btn btn-light',

    'items' => [

        [
            'icon' => 'fa-solid fa-copy',
            'tooltip' => 'Copiar',
        ],

        [
            'icon' => 'fa-solid fa-paste',
            'tooltip' => 'Pegar',
        ],

    ]
]) ?>
```

Toolbar tipo editor real:

```php
<?= component('toolbar', [

    'class' => 'editor-toolbar',
    'rounded' => true,
    'shadow' => true,
    'background' => '#f8fafc',

    'items' => [

        [
            'icon' => 'fa-solid fa-bold',
            'tooltip' => 'Negrita',
            'onclick' => 'editor.bold()',
            'active' => $isBold ?? false,
        ],

        [
            'icon' => 'fa-solid fa-italic',
            'tooltip' => 'Cursiva',
            'onclick' => 'editor.italic()',
            'active' => $isItalic ?? false,
        ],

        [
            'icon' => 'fa-solid fa-underline',
            'tooltip' => 'Subrayado',
            'onclick' => 'editor.underline()',
        ],

        [
            'icon' => 'fa-solid fa-link',
            'tooltip' => 'Insertar enlace',
            'onclick' => 'editor.link()',
        ],

    ]
]) ?>
```
