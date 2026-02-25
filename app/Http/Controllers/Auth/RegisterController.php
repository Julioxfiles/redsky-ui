<?php
declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Request;
use Core\Http\Client\ApiClient;
use Core\Http\Exceptions\ApiValidationException;
use Core\Http\Exceptions\ApiServerException;
use Core\Http\Exceptions\NetworkException;

class RegisterController extends Controller
{
    /**
     * Show register form
     */
    public function show(): void
    {
        $this->view('auth.register', [
            'errors' => $_SESSION['errors'] ?? [],
            'old'    => $_SESSION['old'] ?? [],
            'success' => $_SESSION['success'] ?? null
        ]);

        // Limpiar datos de sesión después de mostrar
        unset($_SESSION['errors'], $_SESSION['old'], $_SESSION['success']);
    }

    /**
     * Handle register form submission (UI only)
     */
    public function store(Request $request): void
    {
        $data = $request->all();
        $_SESSION['old'] = $data; // Guardar datos para repoblar formulario

        try {
            $api = new ApiClient();
            //$response = $api->post('/auth/register', $data);
            $response = $api->post('/api/users', $data);

            // Registrar mensaje de éxito desde la respuesta de la API
            $_SESSION['success'] = $response->message() ?: 'Account created successfully';
            unset($_SESSION['old']); // Limpiar datos antiguos al éxito
            $this->redirect('/login');

        } catch (ApiValidationException $e) {
            $_SESSION['errors'] = $e->errors();
            $this->redirect('/register');

        } catch (ApiServerException $e) {
            $_SESSION['errors'] = ['general' => $e->getMessage()];
            $this->redirect('/register');

        } catch (NetworkException $e) {
            $_SESSION['errors'] = ['general' => 'Cannot connect to the API. Please try again later.'];
            $this->redirect('/register');

        } catch (\Exception $e) {
            // Captura cualquier error inesperado
            $_SESSION['errors'] = ['general' => 'Unexpected error: ' . $e->getMessage()];
            $this->redirect('/register');
        }
    }
}
