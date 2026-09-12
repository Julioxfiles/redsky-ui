<?php

declare(strict_types=1);

$component = $component ?? null;

if ($component === null) {
    return;
}

?>

<header class="documentation-header">

    <h2 class="documentation-title">

        <?= htmlspecialchars($component->name()) ?>

        <dd>
            <code>
                <?= htmlspecialchars(
                    "use " . $component->class()
                ) ?>
            </code>
        </dd>

    </h2>


    <div class="documentation-meta">

        <?php if ($component->isDeprecated()): ?>

            <span class="documentation-badge documentation-badge-danger">
                Deprecated
            </span>

        <?php endif; ?>

    </div>

</header>