<?php

$components = $components ?? [];

$categories = [];

foreach ($components as $component) {

    $category = $component->category() ?? 'General';

    $categories[$category][] = $component;
}

ksort($categories);

?>

<style>

    .component-search {
        margin-bottom: 1rem;
    }

    .component-category {
        margin-bottom: 0.75rem;
    }

    .component-category summary {
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 600;
        padding: 0.25rem 0;
    }

    .category-content {
        padding-left: 1.25rem;
        margin-top: 0.5rem;
    }

    .component-item {
        margin-bottom: 0.35rem;
    }

    .component-item a {
        text-decoration: none;
    }

    .component-item a:hover {
        text-decoration: underline;
    }

</style>


<h1>
    HTML Components Documentation
</h1>


<p>
    Available HTML components provided by RedSky HTML.
</p>


<div class="component-search">

    <input
        type="search"
        id="component-search"
        placeholder="Search components..."
        autocomplete="off"
    >

</div>


<?php if (empty($components)): ?>

    <div class="alert alert-info">
        No components available.
    </div>

<?php else: ?>


    <div id="component-list">


        <?php foreach ($categories as $category => $categoryComponents): ?>

            <details class="component-category">


                <summary>
                    <?= htmlspecialchars($category) ?>
                </summary>


                <div class="category-content">


                    <?php foreach ($categoryComponents as $component): ?>

                        <div class="component-item">

                            <a
                                href="/redsky/redsky-ui/public/html/docs/components/<?= htmlspecialchars($component->name()) ?>"
                            >
                                <?= htmlspecialchars($component->name()) ?>
                            </a>

                        </div>

                    <?php endforeach; ?>


                </div>


            </details>

        <?php endforeach; ?>


    </div>


<?php endif; ?>


<script>

document.addEventListener('DOMContentLoaded', function () {

    const searchInput =
        document.getElementById('component-search');


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener('input', function () {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();


        document
            .querySelectorAll('.component-category')
            .forEach(function (category) {


                const components =
                    category.querySelectorAll('.component-item');


                let visibleComponents = 0;


                components.forEach(function (component) {

                    const name =
                        component
                            .querySelector('a')
                            .textContent
                            .toLowerCase()
                            .trim();


                    const matches =
                        name.includes(search);


                    component.style.display =
                        matches ? '' : 'none';


                    if (matches) {
                        visibleComponents++;
                    }

                });


                category.style.display =
                    visibleComponents > 0
                        ? ''
                        : 'none';


                /*
                 * Open the category automatically
                 * when a search result is found.
                 */

                if (
                    search !== ''
                    && visibleComponents > 0
                ) {
                    category.open = true;
                }


            });

    });

});

</script>