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
        $attrString .= " {$key}=\"" . htmlspecialchars($val) . "\"";
    }
}

?>

<div class="mb-3">

    <?php if ($label): ?>
        <label for="<?= htmlspecialchars($id) ?>" class="form-label">
            <?= htmlspecialchars($label) ?>
        </label>
    <?php endif; ?>

    <input
        type="<?= htmlspecialchars($type) ?>"
        name="<?= htmlspecialchars($name) ?>"
        id="<?= htmlspecialchars($id) ?>"
        value="<?= htmlspecialchars($value) ?>"
        placeholder="<?= htmlspecialchars($placeholder) ?>"
        class="<?= htmlspecialchars($class) ?>"
        <?= $attrString ?>
    >

    <?php if ($error): ?>
        <div class="invalid-feedback">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

</div>