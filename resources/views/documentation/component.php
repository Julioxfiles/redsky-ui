<?php

declare(strict_types=1);

$component = $component ?? null;

if ($component === null) {
    return;
}


$methods = $component->methods();

$ownMethods = [];

$inheritedMethods = [];


foreach ($methods as $method) {

    if ($method->isInherited()) {

        $inheritedMethods[] = $method;

    } else {

        $ownMethods[] = $method;

    }

}


$examples = method_exists($component, 'exampleFiles')
    ? $component->exampleFiles()
    : [];

?>


<div class="documentation">


    <?php require __DIR__ . '/header.php'; ?>


    <?php require __DIR__ . '/description.php'; ?>
    

    <?php require __DIR__ . '/examples.php'; ?>


    <?php require __DIR__ . '/methods.php'; ?>


    <?php require __DIR__ . '/inherited-methods.php'; ?>


    <?php require __DIR__ . '/navigation.php'; ?>


</div>


<script>

document.addEventListener('DOMContentLoaded', function () {

    if (typeof Prism !== 'undefined') {

        Prism.highlightAll();

    }

});

</script>