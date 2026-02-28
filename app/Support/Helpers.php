<?php

if (! function_exists('config')) {
    function config(string $key, $default = null)
    {
        static $configs = [];

        if (empty($configs)) {
            foreach (glob(__DIR__ . '/../../config/*.php') as $file) {
                $name = basename($file, '.php');
                $configs[$name] = require $file;
            }
        }

        [$file, $item] = array_pad(explode('.', $key, 2), 2, null);

        return $configs[$file][$item] ?? $default;
    }
}