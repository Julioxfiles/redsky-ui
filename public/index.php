<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('BASE_PATH', dirname(__DIR__));

require_once BASE_PATH . '/vendor/autoload.php';

/**
 * ENV
 */
$dotenv = Dotenv\Dotenv::createImmutable(BASE_PATH);
$dotenv->load();

/**
 * BOOTSTRAP
 */
$app = require BASE_PATH . '/bootstrap/app.php';

/**
 * RUN APPLICATION
 */
$app->run();