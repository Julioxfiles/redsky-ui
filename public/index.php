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
 * Bootstrap
 */
require_once BASE_PATH . '/bootstrap/app.php';
require_once BASE_PATH . '/bootstrap/helpers.php';

/**
 * Env
 */
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(BASE_PATH);
$dotenv->load();

/**
 * Core classes
 */
use App\Http\Request;
use App\Http\Kernel;

/**
 * ============================
 * 1. START SESSION
 * ============================
 */
session_start();

/**
 * ============================
 * 2. REQUEST
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
 * 4. KERNEL HANDLES EVERYTHING
 * ============================
 */

use App\Http\Router\Router;
use App\Core\Session\Session;

// (tu test actual de sesión lo puedes dejar aquí)
$session = new Session();
// $session->forget("user");

$kernel = new Kernel();

/**
 * IMPORTANT:
 * Kernel ahora es el ORQUESTADOR
 */
$response = $kernel->handle($request);

/**
 * ============================
 * 5. SEND RESPONSE
 * ============================
 */
$response->send();