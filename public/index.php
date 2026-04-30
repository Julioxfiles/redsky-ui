<?php
declare(strict_types=1);

/**
 * =========================================================
 *  REDSKY UI - FRONT CONTROLLER
 * =========================================================
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * Base paths
 */
define('BASE_PATH', dirname(__DIR__));
define('BASE_URI', '/redsky-ui/public');

/**
 * Composer autoload
 */
require_once BASE_PATH . '/vendor/autoload.php';

/**
 * Bootstrap (AQUÍ se crea y configura el Router)
 */
require_once BASE_PATH . '/bootstrap/app.php';
require_once BASE_PATH . '/bootstrap/helpers.php';

/**
 * Load environment variables (.env)
 */
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(BASE_PATH);
$dotenv->load();

/**
 * Use core classes
 */
use App\Http\Request;
use App\Http\Router\Router;

/**
 * ============================
 * 1. START SESSION
 * ============================
 */
session_start();

/**
 * ============================
 * 2. CREATE REQUEST
 * ============================
 */
$request = Request::capture();

/**
 * ============================
 * 3. LOAD ROUTES
 * ============================
 */
require_once BASE_PATH . '/routes/web.php';

/**
 * ============================
 * 4. DISPATCH ROUTER
 * ============================
 */

/* Probando AuthMiddleware

*/
use App\Core\Session\Session;
$session = new Session;
//$session->put('user',10);
$session->forget("user");

//session()->forget('user');
//session('user', null);

$router = Router::getInstance(); // Ya fue creado/configurado en app.php solo devuelve la misma instancia.
$response = $router->dispatch($request);

/**
 * ============================
 * 5. SEND RESPONSE
 * ============================
 */
$response->send();