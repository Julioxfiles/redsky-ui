<?php
declare(strict_types=1);

if (!function_exists('dd')) {

    /**
     * Dump variables with a dark-themed syntax highlighting and die.
     *
     * Background: #212121
     * Text colors: soft whites and grays
     *
     * @param mixed ...$vars
     * @return never
     */
    function dd(mixed ...$vars): never
    {
        echo '<style>
            .dd-container {
                font-family: monospace;
                background: #212121;
                color: #e0e0e0;
                padding: 16px;
                border-radius: 6px;
            }
            .dd-key { color: #b0b0b0; }
            .dd-string { color: #c3e88d; }
            .dd-number { color: #82aaff; }
            .dd-null { color: #ff6b6b; }
            .dd-bool { color: #ffcb6b; }
            details { margin-left: 20px; }
            summary {
                cursor: pointer;
                color: #e0e0e0;
            }
        </style>';

        echo '<div class="dd-container">';

        foreach ($vars as $var) {
            render_dd($var);
        }

        echo '</div>';
        exit(1);
    }

    /**
     * Recursively renders a variable with dark-theme HTML formatting.
     */
    function render_dd(mixed $value): void
    {
        if (is_array($value)) {
            echo '<details open><summary>array (' . count($value) . ')</summary>';
            foreach ($value as $key => $val) {
                echo '<div>';
                echo '<span class="dd-key">' . htmlspecialchars((string)$key) . '</span> => ';
                render_dd($val);
                echo '</div>';
            }
            echo '</details>';
            return;
        }

        if (is_object($value)) {
            echo '<details open><summary>object ' . get_class($value) . '</summary>';
            foreach (get_object_vars($value) as $key => $val) {
                echo '<div>';
                echo '<span class="dd-key">' . htmlspecialchars((string)$key) . '</span> => ';
                render_dd($val);
                echo '</div>';
            }
            echo '</details>';
            return;
        }

        if (is_string($value)) {
            echo '<span class="dd-string">"' . htmlspecialchars($value) . '"</span><br>';
            return;
        }

        if (is_int($value) || is_float($value)) {
            echo '<span class="dd-number">' . $value . '</span><br>';
            return;
        }

        if (is_bool($value)) {
            echo '<span class="dd-bool">' . ($value ? 'true' : 'false') . '</span><br>';
            return;
        }

        if ($value === null) {
            echo '<span class="dd-null">null</span><br>';
            return;
        }

        echo htmlspecialchars((string)$value) . '<br>';
    }
}

if (!function_exists('dump')) {

    /**
     * Dump variables with a dark-themed syntax highlighting.
     *
     * Identical to dd(), but does NOT terminate execution.
     *
     * @param mixed ...$vars
     * @return void
     */
    function dump(mixed ...$vars): void
    {
        static $stylePrinted = false;

        if (!$stylePrinted) {
            echo '<style>
                .dd-container {
                    font-family: monospace;
                    background: #212121;
                    color: #e0e0e0;
                    padding: 16px;
                    border-radius: 6px;
                    margin-bottom: 16px;
                }
                .dd-key { color: #b0b0b0; }
                .dd-string { color: #c3e88d; }
                .dd-number { color: #82aaff; }
                .dd-null { color: #ff6b6b; }
                .dd-bool { color: #ffcb6b; }
                details { margin-left: 20px; }
                summary { cursor: pointer; }
            </style>';
            $stylePrinted = true;
        }

        echo '<div class="dd-container">';

        foreach ($vars as $var) {
            render_dump($var);
        }

        echo '</div>';
    }

    /**
     * Recursively renders a variable for dump().
     */
    function render_dump(mixed $value): void
    {
        if (is_array($value)) {
            echo '<details open><summary>array (' . count($value) . ')</summary>';
            foreach ($value as $key => $val) {
                echo '<div>';
                echo '<span class="dd-key">' . htmlspecialchars((string)$key) . '</span> => ';
                render_dump($val);
                echo '</div>';
            }
            echo '</details>';
            return;
        }

        if (is_object($value)) {
            echo '<details open><summary>object ' . get_class($value) . '</summary>';
            foreach (get_object_vars($value) as $key => $val) {
                echo '<div>';
                echo '<span class="dd-key">' . htmlspecialchars((string)$key) . '</span> => ';
                render_dump($val);
                echo '</div>';
            }
            echo '</details>';
            return;
        }

        if (is_string($value)) {
            echo '<span class="dd-string">"' . htmlspecialchars($value) . '"</span><br>';
            return;
        }

        if (is_int($value) || is_float($value)) {
            echo '<span class="dd-number">' . $value . '</span><br>';
            return;
        }

        if (is_bool($value)) {
            echo '<span class="dd-bool">' . ($value ? 'true' : 'false') . '</span><br>';
            return;
        }

        if ($value === null) {
            echo '<span class="dd-null">null</span><br>';
            return;
        }

        echo htmlspecialchars((string)$value) . '<br>';
    }
}