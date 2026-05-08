<?php
declare(strict_types=1);

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('BASE_PATH', dirname(__DIR__));
define('BASE_URI', '/redsky-ui/public');

require_once BASE_PATH . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(BASE_PATH);
$dotenv->load();

use App\Http\Request;
use App\Http\Kernel;

$request = Request::capture();

$kernel = new Kernel();

$response = $kernel->handle($request);

$response->send();