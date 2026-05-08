<?php

$name = $name ?? '';
$id = $id ?? $name;
$value = $value ?? old($name) ?? '';
$class = $class ?? 'form-control';
$error = $error ?? errors($name);
$attributes = $attributes ?? [];

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

<textarea
    name="<?= e($name) ?>"
    id="<?= e($id) ?>"
    class="<?= e($class) ?>"
    <?= $attrString ?>
><?= e($value) ?></textarea>

<?php if ($error): ?>
    <div class="invalid-feedback">
        <?= e($error) ?>
    </div>
<?php endif; ?>