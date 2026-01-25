<?php
// public/index.php
// HTTP Entry Point - http://localhost/skynet-ui/api
declare(strict_types=1);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('BASE_PATH', dirname(__DIR__));
//echo "BASE_PATH:".var_dump(BASE_PATH)."<br/>";
define('BASE_URI', '/skynet-ui/public');
//echo "BASE_URI:".var_dump(BASE_URI)."<br/>";

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

use App\Http\Router\Router;
use App\Http\Router\Route;

// cargar rutas
require_once __DIR__ . '/../routes/web.php';

// Create router
// despachar la request
Router::getInstance()->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);

session_start();
use App\Http\Middleware\VerifyCsrfToken;
VerifyCsrfToken::handle();