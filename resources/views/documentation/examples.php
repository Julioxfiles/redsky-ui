<?php

declare(strict_types=1);

$component = $component ?? null;

if ($component === null) {
    return;
}

?>

<?php if (!empty($examples)): ?>

<section class="documentation-section">

    <h2>
        Examples
    </h2>

    <?php foreach ($examples as $index => $example): ?>

        <div class="documentation-example documentation-card">

            <h5>
                <?= htmlspecialchars($example->title()) ?>.php
            </h5>



            <?php if ($example->description() !== null): ?>


                <p class="documentation-example-description">

                    <?= htmlspecialchars(
                        $example->description()
                    ) ?>

                </p>


            <?php endif; ?>

            <div
                class="tabs"
                data-component="tabs">

                <div class="tabs-navigation">

                    <button
                        type="button"
                        class="tab active"
                        data-tab-target="php-<?= $index ?>"
                        role="tab"
                        aria-selected="true">

                        PHP

                    </button>

                    <?php if ($example->hasOutput()): ?>

                        <button
                            type="button"
                            class="tab"
                            data-tab-target="html-<?= $index ?>"
                            role="tab"
                            aria-selected="false">

                            HTML

                        </button>



                        <button
                            type="button"
                            class="tab"
                            data-tab-target="css-<?= $index ?>"
                            role="tab"
                            aria-selected="false">

                            CSS

                        </button>

                        <button
                            type="button"
                            class="tab"
                            data-tab-target="javascript-<?= $index ?>"
                            role="tab"
                            aria-selected="false">

                            JavaScript

                        </button>


                    <?php endif; ?>

                </div>

                <div class="tabs-content">

                    <div
                        id="php-<?= $index ?>"
                        class="tab-panel active"
                        data-tab-panel
                        role="tabpanel">

                        <div class="documentation-example-code-title">

                            PHP
                            <button
                                type="button"
                                class="documentation-example-copy"
                                data-target="php-output-<?= $index ?>"
                                title="Copy code"
                                aria-label="Copy code">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>

                            </button>
                        </div>

                        <pre id="php-output-<?= $index ?>"  class="language-php">
                            <code>
                                <?= htmlspecialchars($example->source()) ?>
                            </code>
                        </pre>


                    </div>




                    <?php if ($example->hasOutput()): ?>



                        <div
                            id="html-<?= $index ?>"
                            class="tab-panel"
                            data-tab-panel
                            role="tabpanel"
                            hidden>


                            <div class="documentation-example-code-title">

                                HTML
                                <button
                                    type="button"
                                    class="documentation-example-copy"
                                    data-target="html-output-<?= $index ?>"
                                    title="Copy code"
                                    aria-label="Copy code">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>

                                </button>

                            </div>

                            <pre id="html-output-<?= $index ?>"  class="language-markup">
                                <code>
                                    <?= htmlspecialchars($example->output()) ?>
                                </code>
                            </pre>


                        </div>

                        <div
                            id="css-<?= $index ?>"
                            class="tab-panel"
                            data-tab-panel
                            role="tabpanel"
                            hidden>

                            <div class="documentation-example-code-title">
                                CSS
                                <button
                                    type="button"
                                    class="documentation-example-copy"
                                    data-target="css-output-<?= $index ?>"
                                    title="Copy code"
                                    aria-label="Copy code">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>

                                </button>

                            </div>

                            <pre id="css-output-<?= $index ?>"  class="language-css">
                                <code>
                                    <?= htmlspecialchars( $example->cssFile() ?? '' ) ?>
                                </code>
                            </pre>


                        </div>

                        <div
                            id="javascript-<?= $index ?>"
                            class="tab-panel"
                            data-tab-panel
                            role="tabpanel"
                            hidden>

                            <div class="documentation-example-code-title">
                                JavaScript
                                <button
                                    type="button"
                                    class="documentation-example-copy"
                                    data-target="javascript-output-<?= $index ?>"
                                    title="Copy code"
                                    aria-label="Copy code">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>

                                </button>

                            </div>

                            <pre id="javascript-output-<?= $index ?>" class="language-javascript">
                                <code>
                                    <?= htmlspecialchars($example->jsFile() ?? '' ) ?>
                                </code>
                            </pre>


                        </div>



                    <?php endif; ?>



                </div>


            </div>




            <div class="documentation-example-code">


                <div class="documentation-example-output-title">

                    Component Rendered

                </div>



                <div class="documentation-example-component-rendered">

                    <?= $example->output() ?>

                </div>


            </div>

        </div>

    <?php endforeach; ?>

</section>

<?php endif; ?>