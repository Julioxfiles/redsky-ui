<?php

$icon       = $icon ?? null;
$label      = $label ?? null;
$tooltip    = $tooltip ?? null;
$onclick    = $onclick ?? null;
$href       = $href ?? null;
$target     = $target ?? null;

$active     = $active ?? false;
$disabled   = $disabled ?? false;
$visible    = $visible ?? true;

$id         = $id ?? null;

$class      = $class ?? 'rs-toolbar-item';
$iconClass  = $iconClass ?? 'rs-toolbar-icon';
$labelClass = $labelClass ?? 'rs-toolbar-label';

$attributes = $attributes ?? [];

// 🔴 no renderizar si visible = false
if (!$visible) {
    return;
}

// 🔴 estados
if ($active) {
    $class .= ' active';
}

if ($disabled) {
    $class .= ' disabled';
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

// 🔹 atributos comunes
$commonAttributes = '';

if ($id) {
    $commonAttributes .= ' id="' . e($id) . '"';
}

if ($tooltip) {
    $commonAttributes .= ' data-tooltip="' . e($tooltip) . '"';
}

if ($onclick && !$disabled) {
    $commonAttributes .= ' onclick="' . e($onclick) . '"';
}

if ($disabled) {
    $commonAttributes .= ' aria-disabled="true"';
}

?>

<?php if ($href && !$disabled): ?>

    <a
        href="<?= e($href) ?>"
        class="<?= e($class) ?>"
        <?= $target ? 'target="' . e($target) . '"' : '' ?>
        <?= $commonAttributes ?>
        <?= $attrString ?>
    >

        <?php if ($icon): ?>
            <i class="<?= e($iconClass . ' ' . $icon) ?>"></i>
        <?php endif; ?>

        <?php if ($label): ?>
            <span class="<?= e($labelClass) ?>">
                <?= e($label) ?>
            </span>
        <?php endif; ?>

    </a>

<?php else: ?>

    <button
        type="button"
        class="<?= e($class) ?>"
        <?= $disabled ? 'disabled' : '' ?>
        <?= $commonAttributes ?>
        <?= $attrString ?>
    >

        <?php if ($icon): ?>
            <i class="<?= e($iconClass . ' ' . $icon) ?>"></i>
        <?php endif; ?>

        <?php if ($label): ?>
            <span class="<?= e($labelClass) ?>">
                <?= e($label) ?>
            </span>
        <?php endif; ?>

    </button>

<?php endif; ?>