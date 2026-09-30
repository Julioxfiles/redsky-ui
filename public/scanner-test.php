<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/redsky-html/vendor/autoload.php';

use RedSky\Html\Documentation\ComponentScanner;

$scanner = new ComponentScanner();

$scanner->scan();

echo '<pre>';

print_r($scanner->errors());

echo '</pre>';