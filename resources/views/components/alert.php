<?php

/**
 * Alert Component
 * 
 * Available props:
 * - type (string) → success | danger | warning | info
 * - message (string)
 * - id (string)
 * - class (string)
 * - attributes (array)
 * - slot (string) → custom HTML content
 */

$type = $type ?? 'info';
$message = $message ?? '';
$id = $id ?? null;
$class = $class ?? "alert alert-{$type}";
$attributes = $attributes ?? [];
$slot = $slot ?? null;

/**
 * Build extra attributes string
 */
$attrString = '';

foreach ($attributes as $key => $val) {

    if (is_bool($val)) {

        if ($val) {
            $attrString .= " {$key}";
        }

    } else {

        $attrString .= " {$key}=\"" .
            htmlspecialchars($val) .
            "\"";
    }
}

/**
 * Resolve content
 */
$content = $slot ?? htmlspecialchars($message);

?>

<div
    <?= $id ? 'id="' . htmlspecialchars($id) . '"' : '' ?>
    class="<?= htmlspecialchars($class) ?>"
    <?= $attrString ?>
>
    <?= $content ?>
</div>