<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        <?= $title ?? 'RedSky UI' ?>
    </title>


    <?php foreach ($styles ?? [] as $style): ?>

        <link
            rel="stylesheet"
            href="<?= $style ?>"
        >

    <?php endforeach; ?>


    <!-- Default application styles -->
     <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
    >

    <link
        rel="stylesheet"
        href="/redsky/redsky-ui/public/assets/css/app.css"
    >

</head>


<body>


<div class="container">

    <?php $content = $content ?? ''; ?>

    <?= $content ?>

</div>


<?php foreach ($scripts ?? [] as $script): ?>

    <script src="<?= $script ?>"></script>

<?php endforeach; ?>


</body>

</html>


<?php
/*
|--------------------------------------------------------------------------
| Responsabilidad de este archivo
|--------------------------------------------------------------------------
|
| Este archivo es un layout HTML de la aplicación.
|
| Sus responsabilidades son:
|
| - Definir la estructura HTML base.
| - Mostrar el título de la página.
| - Cargar estilos registrados.
| - Cargar los estilos principales de la aplicación.
| - Mostrar el contenido generado por una vista.
| - Cargar scripts registrados.
|
| Variables disponibles:
|
| $content
|   Contenido generado por redsky-view.
|
| $title
|   Título definido por la vista.
|
| $styles
|   Assets CSS registrados.
|
| $scripts
|   Assets JavaScript registrados.
|
| Este archivo NO debe:
|
| - Crear lógica de negocio.
| - Elegir la librería UI.
| - Resolver componentes.
|
| Es solamente la plantilla visual final.
|
*/
?>