<?php

$action = $action ?? '';
$method = strtoupper($method ?? 'POST');
$class = $class ?? '';
$attributes = $attributes ?? [];

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

$realMethod = in_array($method, ['GET', 'POST']) ? $method : 'POST';
?>

<form
    action="<?= e($action) ?>"
    method="<?= e($realMethod) ?>"
    class="<?= e($class) ?>"
    <?= $attrString ?>
>

<?php if ($method !== 'GET' && $method !== 'POST'): ?>
    <input type="hidden" name="_method" value="<?= e($method) ?>">
<?php endif; ?>

<input type="hidden" name="_token" value="<?= e(csrf_token()) ?>">

<?= $slot ?? '' ?>

</form>