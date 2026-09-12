<?php

declare(strict_types=1);

?>

<!DOCTYPE html>

<html lang="en" class="dark">    

<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title>
        <?= htmlspecialchars($title ?? 'RedSky UI') ?>
    </title>

    <!-- Bootstrap 
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
    >
     -->


    <!-- Materialize 
    <link
       rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
    >
     -->

    <!-- Font Awesome -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
    >


    <!-- RedSky UI -->
    <link rel="stylesheet" href="/redsky/redsky-ui/public/assets/css/app.css">
    <link rel="stylesheet" href="/redsky/redsky-ui/public/assets/css/prism.css">
    <link rel="stylesheet" href="/redsky/redsky-ui/public/assets/css/documentation.css">
    <link rel="stylesheet" href="/redsky/redsky-ui/public/assets/css/components/interactive/tabs/tabs.css">
    <link rel="stylesheet" href="/redsky/redsky-ui/public/assets/css/components/interactive/modal/modal.css">
    <!-- 
    <link rel="stylesheet" href="/redsky/redsky-ui/public/assets/css/components/interactive/datagrid/datagrid.css">
-->

</head>

<body>

    <button
        id="theme-toggle"
        type="button"
        style="
            display:block;
            position:fixed;
            top:20px;
            right:20px;
            z-index:99999;
            background:#181818;
            color:white;
            padding:10px 20px;
            border:1px solid #555;
            border-radius:6px;
            cursor:pointer;
        ">
        Theme
    </button>

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

    <!-- Bootstrap 
    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
    ></script>
     -->

    <!-- Materialize 
    <script  
        src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"
    >
    </script>
     -->

    <script src="/redsky/redsky-ui/public/assets/js/app.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/themes.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/prism.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/components/documentation/documentation.js"></script>
    <script type="module" src="/redsky/redsky-ui/public/assets/js/components/component.js"></script>
    <script type="module" src="/redsky/redsky-ui/public/assets/js/components/interactive/modal/modal.js"></script>
    <script type="module" src="/redsky/redsky-ui/public/assets/js/components/interactive/datagrid/datagrid.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/components/interactive/spinner/spinner.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/components/interactive/tabs/tabs.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/components/feedback/progress/progress.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/components/feedback/alert/alert.js"></script>
    <script src="/redsky/redsky-ui/public/assets/js/components/feedback/toast/toast.js"></script>

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