```php
<?php

$items          = $items ?? [];

$id             = $id ?? null;

$class          = $class ?? 'rs-toolbar';
$itemClass      = $itemClass ?? null;

$vertical       = $vertical ?? false;
$fixed          = $fixed ?? false;

$position       = $position ?? 'top';

$gap            = $gap ?? '0.5rem';

$background     = $background ?? null;
$color          = $color ?? null;
$border         = $border ?? null;
$shadow         = $shadow ?? false;
$rounded        = $rounded ?? false;

$attributes     = $attributes ?? [];

// 🔴 orientación
if ($vertical) {
    $class .= ' rs-toolbar-vertical';
}

// 🔴 fixed
if ($fixed) {
    $class .= ' rs-toolbar-fixed';
    $class .= ' rs-toolbar-' . $position;
}

// 🔴 estilos opcionales
if ($shadow) {
    $class .= ' shadow';
}

if ($rounded) {
    $class .= ' rounded';
}

// 🔹 estilos inline
$style = '';

$style .= "gap: {$gap};";

if ($background) {
    $style .= "background: {$background};";
}

if ($color) {
    $style .= "color: {$color};";
}

if ($border) {
    $style .= "border: {$border};";
}

// 🔹 construir atributos HTML
$attrString = '';

foreach ($attributes as $key => $val) {

    if (is_bool($val)) {

        if ($val) {
            $attrString .= " {$key}";
        }

    } else {

        $attrString .= " {$key}=\"" . e($val) . "\"";
    }
}

?>

<div
    <?= $id ? 'id="' . e($id) . '"' : '' ?>
    class="<?= e($class) ?>"
    style="<?= e($style) ?>"
    <?= $attrString ?>
>

    <?php foreach ($items as $item): ?>

        <?php

        // 🔹 heredar clases globales
        if ($itemClass) {

            $item['class'] = trim(
                ($item['class'] ?? '') . ' ' . $itemClass
            );
        }

        // 🔹 heredar color global
        if ($color && !isset($item['attributes']['style'])) {

            $item['attributes']['style'] = "color: {$color};";
        }

        ?>

        <?= component('toolbar-item', $item) ?>

    <?php endforeach; ?>

</div>
```
