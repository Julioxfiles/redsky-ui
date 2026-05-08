<?php

$name = $name ?? '';
$message = errors($name);
?>

<?php if ($message): ?>
    <div class="invalid-feedback">
        <?= e($message) ?>
    </div>
<?php endif; ?>