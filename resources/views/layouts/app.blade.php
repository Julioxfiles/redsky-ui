<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="<?= asset('css/bootstrap.min.css') ?>">
    <link rel="stylesheet" href="<?= asset('assets/fontawesome-free-5.15.4-web/css/all.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/app.css') ?>?v=<?= time() ?>">
    <title>@yield('title')</title>
</head>
<body>

@yield('content')

</body>
</html>
