<?php

$name = $name ?? '';
$id = $id ?? $name;
$checked = $checked ?? false;
$value = $value ?? '1';
$class = $class ?? '';
$attributes = $attributes ?? [];
$error = $error ?? errors($name);

if ($error) {
    $class .= ' is-invalid';
}

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

<input
    type="checkbox"
    name="<?= e($name) ?>"
    id="<?= e($id) ?>"
    value="<?= e($value) ?>"
    class="<?= e($class) ?>"
    <?= $checked ? 'checked' : '' ?>
    <?= $attrString ?>
>

<?php if ($error): ?>
    <div class="invalid-feedback">
        <?= e($error) ?>
    </div>
<?php endif; ?>