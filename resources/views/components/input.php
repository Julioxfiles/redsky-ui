<?php

$type        = $type ?? 'text';
$name        = $name ?? '';
$id          = $id ?? $name;
$label       = $label ?? null;
$placeholder = $placeholder ?? '';
$value       = $value ?? old($name) ?? '';
$error       = $error ?? errors($name);
$attributes  = $attributes ?? [];
$class       = $class ?? 'form-control';

// 🔴 si hay error → agregar clase
if ($error) {
    $class .= ' is-invalid';
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

<div class="mb-3">

    <?php if ($label): ?>
        <label for="<?= e($id) ?>" class="form-label">
            <?= e($label) ?>
        </label>
    <?php endif; ?>

    <input
        type="<?= e($type) ?>"
        name="<?= e($name) ?>"
        id="<?= e($id) ?>"
        value="<?= e($value) ?>"
        placeholder="<?= e($placeholder) ?>"
        class="<?= e($class) ?>"
        <?= $attrString ?>
    >

    <?php if ($error): ?>
        <div class="invalid-feedback">
            <?= e($error) ?>
        </div>
    <?php endif; ?>

</div>