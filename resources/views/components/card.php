<?php

/**
 * Card Component
 * 
 * Available props:
 * - title (string)
 * - slot (string)
 * - footer (string)
 * 
 * - image (string) → image URL
 * - imageAlt (string)
 * - imagePosition (string) → top | left | right
 * - imageWidth (string|int)
 * - imageHeight (string|int)
 * 
 * - id (string)
 * - class (string)
 * - attributes (array)
 */

$title = $title ?? null;
$slot = $slot ?? null;
$footer = $footer ?? null;

$image = $image ?? null;
$imageAlt = $imageAlt ?? '';
$imagePosition = $imagePosition ?? 'top';
$imageWidth = $imageWidth ?? null;
$imageHeight = $imageHeight ?? null;

$id = $id ?? null;
$class = $class ?? 'card';
$attributes = $attributes ?? [];

/**
 * Build attributes string
 */
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

/**
 * Image styles
 */
$imageStyle = '';

if ($imageWidth) {
    $imageStyle .= "width:{$imageWidth};";
}

if ($imageHeight) {
    $imageStyle .= "height:{$imageHeight};";
}

?>

<div
    <?= $id ? 'id="' . e($id) . '"' : '' ?>
    class="<?= e($class) ?>"
    <?= $attrString ?>
>

    <?php if ($image && $imagePosition === 'top'): ?>
        <img
            src="<?= e($image) ?>"
            alt="<?= e($imageAlt) ?>"
            style="<?= e($imageStyle) ?>"
            class="card-img-top"
        >
    <?php endif; ?>

    <div class="card-body">

        <?php if ($image && $imagePosition === 'left'): ?>
            <img
                src="<?= e($image) ?>"
                alt="<?= e($imageAlt) ?>"
                style="<?= e($imageStyle) ?>"
                class="float-start me-3"
            >
        <?php endif; ?>

        <?php if ($image && $imagePosition === 'right'): ?>
            <img
                src="<?= e($image) ?>"
                alt="<?= e($imageAlt) ?>"
                style="<?= e($imageStyle) ?>"
                class="float-end ms-3"
            >
        <?php endif; ?>

        <?php if ($title): ?>
            <h5 class="card-title">
                <?= e($title) ?>
            </h5>
        <?php endif; ?>

        <?php if ($slot): ?>
            <?= $slot ?>
        <?php endif; ?>

    </div>

    <?php if ($footer): ?>
        <div class="card-footer">
            <?= e($footer) ?>
        </div>
    <?php endif; ?>

</div>