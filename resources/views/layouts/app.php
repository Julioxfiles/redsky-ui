<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" 
        rel="stylesheet"
    >

    <link rel="stylesheet" href="<?= asset('css/app.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/windows.css') ?>">

    <?php foreach ($styles ?? [] as $style): ?>
        <link rel="stylesheet" href="<?= asset($style) ?>">
    <?php endforeach; ?>

    <title><?= $title ?? 'App' ?></title>
</head>

<body>

<?= $content ?? '' ?>


<?= view('partials.footer', [], false) ?>


<script 
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js">
</script>

<script src="<?= asset('js/windows.js') ?>"></script>


<?php foreach ($scripts ?? [] as $script): ?>
    <script src="<?= asset($script) ?>"></script>
<?php endforeach; ?>


</body>
</html>