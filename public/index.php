<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('BASE_PATH', dirname(__DIR__));
define('BASE_URI', '/redsky-ui/public');

require_once BASE_PATH . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(BASE_PATH);
$dotenv->load();

/**
 * BOOTSTRAP LAYER
 */
$app = require BASE_PATH . '/bootstrap/app.php';

use App\Http\Request;

/**
 * REQUEST
 */
$request = Request::capture();

/**
 * HANDLE REQUEST
 */
$response = $app->handle($request);

$response->send();