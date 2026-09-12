<?php

declare(strict_types=1);

$component = $component ?? null;

if ($component === null) {
    return;
}

?>

<section class="documentation-section">

    <div class="documentation-card">

        <?php if ($component->description() !== null): ?>

            <p>
                <?= nl2br(
                    htmlspecialchars(
                        $component->description()
                    )
                ) ?>
            </p>

        <?php else: ?>

            <p class="documentation-muted">
                No description is available for this component.
            </p>

        <?php endif; ?>

    </div>

</section>

