<?php

declare(strict_types=1);

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        <?= htmlspecialchars($title ?? 'RedSky UI') ?>
    </title>


    <?php foreach ($styles ?? [] as $style): ?>

        <link
            rel="stylesheet"
            href="<?= htmlspecialchars($style) ?>"
        >

    <?php endforeach; ?>


    <!-- Bootstrap -->

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
    >


    <!-- RedSky UI -->

    <link
        rel="stylesheet"
        href="/redsky/redsky-ui/public/assets/css/app.css"
    >

    <link
        rel="stylesheet"
        href="/redsky/redsky-ui/public/assets/css/prism.css"
    >

</head>


<body>

    <div class="container">

        <?php

        $content = $content ?? '';

        echo $content;

        ?>

    </div>


    <?php foreach ($scripts ?? [] as $script): ?>

        <script
            src="<?= htmlspecialchars($script) ?>"
        ></script>

    <?php endforeach; ?>

    <script src="/redsky/redsky-ui/public/assets/js/prism.js"></script>
    
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        Prism.highlightAll();
    });
    </script>

    <!-- Prism Highlight -->

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
        });
    </script>

</body>

</html>