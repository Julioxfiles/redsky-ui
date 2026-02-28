<div class="alert alert-<?= htmlspecialchars($type ?? 'info', ENT_QUOTES, 'UTF-8') ?>">
    <?php if (!empty($message)) : ?>
        <p><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>

    <?php if (!empty($slot)) : ?>
        <p><?= $slot ?></p>
    <?php endif; ?>
</div>
