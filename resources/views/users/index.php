<?php $users = $users ?? []; ?>

<h1>
    Usuarios
</h1>


<p>
    Lista de usuarios registrados.
</p>


<table class="table table-bordered">

    <thead>

        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
        </tr>

    </thead>


    <tbody>
        <?php
         if (empty($users)) {
             echo '<tr><td colspan="3">No hay usuarios registrados.</td></tr>';
         }
        ?>

        <?php foreach ($users as $user): ?>

            <tr>

                <td>
                    <?= $user['id'] ?>
                </td>

                <td>
                    <?= $user['nombre'] ?>
                </td>

                <td>
                    <?= $user['email'] ?>
                </td>

            </tr>

        <?php endforeach; ?>

    </tbody>

</table>



<?php
/*
|--------------------------------------------------------------------------
| Responsabilidad de este archivo
|--------------------------------------------------------------------------
|
| Esta es una vista específica de la aplicación.
|
| Sus responsabilidades son:
|
| - Mostrar la información de usuarios.
| - Recibir datos enviados por el controlador.
| - Generar solamente el contenido interno de la página.
|
| El layout será aplicado por redsky-view.
|
| Esta vista NO debe:
|
| - Crear la estructura HTML completa.
| - Cargar Bootstrap manualmente.
| - Elegir layouts.
| - Administrar scripts globales.
|
| El flujo es:
|
| UserController
|       |
|       v
| view('users.index')
|       |
|       v
| redsky-ui
|       |
|       v
| redsky-view
|       |
|       v
| layouts.app
|
*/
?>