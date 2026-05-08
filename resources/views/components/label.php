<?php

$for = $for ?? '';
$text = $text ?? '';
$class = $class ?? 'form-label';
?>

<label for="<?= e($for) ?>" class="<?= e($class) ?>">
    <?= e($text) ?>
</label>