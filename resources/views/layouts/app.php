<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= asset('css/app.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/windows.css') ?>">
    <title><?= $title ?? 'App' ?></title>
</head>
<body>

<?php
 //echo "START-" . microtime(true) . "<br>"; 
 $content = $content ?? '';
 echo $content;
 //echo "END-" . microtime(true) . "<br>";
 ?>

<div class="foot">Hola Julio Acosta</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= asset('js/windows.js') ?>"></script>

</body>
</html>