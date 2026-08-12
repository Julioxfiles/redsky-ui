<?php


$components = $components ?? [];


?>


<h1>
    HTML Components Documentation
</h1>



<p>
    Available HTML components provided by RedSky HTML.
</p>



<?php if (empty($components)): ?>


    <div class="alert alert-info">
        No components available.
    </div>


<?php else: ?>


    <div class="list-group">


        <?php foreach ($components as $component): ?>


             <a
                href="/redsky/redsky-ui/public/html/docs/components/<?= htmlspecialchars($component->name()) ?>"
                class="list-group-item list-group-item-action"
            >


                <div class="d-flex justify-content-between align-items-center">


                    <div>


                        <h5 class="mb-1">
                            <?= htmlspecialchars($component->name()) ?>
                        </h5>



                        <?php if ($component->description() !== null): ?>


                            <p class="mb-1">
                                <?= htmlspecialchars(
                                    $component->description()
                                ) ?>
                            </p>


                        <?php endif; ?>


                    </div>



                    <?php if ($component->category() !== null): ?>


                        <span class="badge bg-secondary">
                            <?= htmlspecialchars(
                                $component->category()
                            ) ?>
                        </span>


                    <?php endif; ?>


                </div>


            </a>


        <?php endforeach; ?>


    </div>


<?php endif; ?>