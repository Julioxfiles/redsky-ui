<?php

use RedSky\Bootstrap\Components\Button;
use RedSky\Bootstrap\Components\Card;

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>RedSky Bootstrap Test</title>

    <!-- Bootstrap CSS -->
    <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
        rel="stylesheet"
    >
</head>

<body>

<div class="container mt-5">

    <h1 class="mb-4">
        RedSky View + Bootstrap
    </h1>

    <p class="lead">
        Prueba de componentes generados desde RedSky.
    </p>

    <hr>

    <h3>
        Button Component
    </h3>

    <div class="mb-4">

        <?php

        echo Button::make([
            'text' => 'Guardar usuario',
            'type' => 'primary'
        ]);

        ?>

    </div>


    <h3>
        Card Component
    </h3>

    <div class="mb-4">

        <?php

        echo Card::make([
            'title' => 'Usuarios',
            'content' => 'Este Card fue generado usando el sistema de componentes RedSky Bootstrap.'
        ]);

        ?>

    </div>


</div>


<!-- Bootstrap JS -->
<script 
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>

</body>
</html>