<?php

/**
 * Select Component
 * 
 * Available props:
 * - name (string)
 * - options (array) → [value => label] OR [['value'=>..., 'label'=>...]]
 * - selected (mixed|array)
 * - id (string)
 * - class (string)
 * - placeholder (string) → optional first option
 * - multiple (bool)
 * - attributes (array)
 */

$name = $name ?? '';
$options = $options ?? [];
$selected = $selected ?? null;
$id = $id ?? $name;
$class = $class ?? 'form-select';
$placeholder = $placeholder ?? null;
$multiple = $multiple ?? false;
$attributes = $attributes ?? [];

/**
 * Normalize selected values (important for multiple select)
 */
$selectedValues = is_array($selected) ? $selected : [$selected];

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
        $attrString .= " {$key}=\"" . e($val) . "\"";
    }
}

/**
 * Handle multiple name (name[])
 */
$inputName = $multiple ? $name . '[]' : $name;

?>

<select
    name="<?= e($inputName) ?>"
    id="<?= e($id) ?>"
    class="<?= e($class) ?>"
    <?= $multiple ? 'multiple' : '' ?>
    <?= $attrString ?>
>

    <?php if ($placeholder && !$multiple): ?>
        <option value="">
            <?= e($placeholder) ?>
        </option>
    <?php endif; ?>

    <?php foreach ($options as $key => $option): ?>

        <?php
        // Support both formats:
        // 1) ['value' => 'Label']
        // 2) [['value'=>1,'label'=>'Admin']]
        if (is_array($option)) {
            $value = $option['value'] ?? '';
            $label = $option['label'] ?? '';
        } else {
            $value = $key;
            $label = $option;
        }

        $isSelected = in_array($value, $selectedValues);
        ?>

        <option 
            value="<?= e($value) ?>"
            <?= $isSelected ? 'selected' : '' ?>
        >
            <?= e($label) ?>
        </option>

    <?php endforeach; ?>

</select>