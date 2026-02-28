<div class="alert alert-<?= $type ?? 'info' ?>">
    <?php if(ViewState::getSlot('alert', 'title')): ?>
        <h4><?= ViewState::getSlot('alert', 'title') ?></h4>
    <?php endif; ?>

    <?php if(ViewState::getSlot('alert', 'slot')): ?>
        <p><?= ViewState::getSlot('alert', 'slot') ?></p>
    <?php elseif(isset($message)): ?>
        <p><?= $message ?></p>
    <?php endif; ?>
</div>