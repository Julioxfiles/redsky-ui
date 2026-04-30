<?php

if (!function_exists('config')) {
    function config(?string $key = null, $default = null)
    {
        static $configs = [];

        // Load config files once
        if (empty($configs)) {
            foreach (glob(__DIR__ . '/../../config/*.php') as $file) {
                $name = basename($file, '.php');
                $configs[$name] = require $file;
            }
        }

        // Return all config
        if ($key === null) {
            return $configs;
        }

        $segments = explode('.', $key);

        $value = $configs;

        foreach ($segments as $segment) {
            if (!isset($value[$segment])) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value;
    }
}

