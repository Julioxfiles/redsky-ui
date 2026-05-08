<?php

/**
 * Button Component
 * 
 * Available props:
 * - type (string) → button | submit | reset
 * - text (string) → fallback content
 * - id (string)
 * - class (string)
 * - attributes (array)
 * - slot (string) → inner HTML content (preferred over text)
 */

$type = $type ?? 'button';
$text = $text ?? '';
$id = $id ?? null;
$class = $class ?? 'btn';
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
        $attrString .= " {$key}=\"" . htmlspecialchars($val) . "\"";
    }
}

/**
 * Resolve content:
 * slot > text
 */
$content = $slot ?? htmlspecialchars($text);

?>

<button
    type="<?= htmlspecialchars($type) ?>"
    <?= $id ? 'id="' . htmlspecialchars($id) . '"' : '' ?>
    class="<?= htmlspecialchars($class) ?>"
    <?= $attrString ?>
>
    <?= $content ?>
</button>