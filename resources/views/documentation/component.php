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

<style>

</style>

<div class="documentation">

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
        </h1>

        <div class="documentation-meta">

            <?php if ($component->isDeprecated()): ?>

                <span class="documentation-badge documentation-badge-danger">
                    Deprecated
                </span>

            <?php endif; ?>

        </div>

    </header>

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

    <?php if (!empty($examples)): ?>

        <section class="documentation-section">

            <h2>
                Examples
            </h2>

            <?php foreach ($examples as $index => $example) : ?>

                <?php if ($example->cssUrl() !== null): ?>

                    <link
                        rel="stylesheet"
                        href="<?= htmlspecialchars(
                            $example->cssUrl()
                        ) ?>"
                    >

                    <?php endif; ?>

                    <?php if ($example->jsUrl() !== null): ?>

                    <script
                        src="<?= htmlspecialchars(
                            $example->jsUrl()
                        ) ?>"
                    ></script>

                    <?php endif; ?>


                <div class="documentation-example documentation-card">

                    <h5>
                        <?= htmlspecialchars($example->title()).".php" ?>
                    </h5>


                    <?php if ($example->description() !== null): ?>

                        <p class="documentation-example-description">
                            <?= htmlspecialchars(
                                $example->description()
                            ) ?>
                        </p>

                    <?php endif; ?>

                <div class="tabs" data-component="tabs">

    <div class="tabs-navigation">

        <button
            type="button"
            class="tab active"
            data-tab-target="php-<?= $index ?>"
            role="tab"
            aria-selected="true">
            PHP
        </button>

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
                    data-target="php-source-<?= $index ?>"
                    title="Copy code">

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">

                        <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2">
                        </rect>

                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1">
                        </path>

                    </svg>

                </button>

            </div>


            <pre id="php-source-<?= $index ?>" class="language-php"><code class="language-php"><?= htmlspecialchars(
                $example->source()
            ) ?></code></pre>


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
                    title="Copy code">

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">

                        <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2">
                        </rect>

                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1">
                        </path>

                    </svg>

                </button>

            </div>


            <pre id="html-output-<?= $index ?>" class="language-markup"><code class="language-markup"><?= htmlspecialchars(
                $example->output()
            ) ?></code></pre>


        </div>



        <div
            id="css-<?= $index ?>"
            class="tab-panel"
            data-tab-panel
            role="tabpanel"
            hidden>


            <div class="documentation-example-code-title">
                CSS
            </div>


            <pre class="language-css"><code class="language-css"></code></pre>


        </div>



        <div
            id="javascript-<?= $index ?>"
            class="tab-panel"
            data-tab-panel
            role="tabpanel"
            hidden>


            <div class="documentation-example-code-title">
                JavaScript
            </div>


            <pre class="language-javascript"><code class="language-javascript"></code></pre>


        </div>


        <?php endif; ?>


    </div>

</div>


                    <div class="documentation-example-code">

                        <br>
                        <div class="documentation-example-output-title">
                            Component Rendered
                        </div>
                        <br>

                        <div class="documentation-example-component-rendered">
                            <?= $example->output() ?>
                        </div>

                    </div>


      

                </div>

            <?php endforeach; ?>

        </section>

    <?php endif; ?>

    <section class="documentation-section">

        <h2>
            Methods
        </h2>

        <p class="documentation-muted">
            Methods provided directly by this component.
        </p>

        <?php if (empty($ownMethods)): ?>

            <div class="documentation-alert">
                No methods documented.
            </div>

        <?php else: ?>

            <div class="documentation-table-wrapper">

                <table class="documentation-table">

                    <thead>

                        <tr>
                            <th>Method</th>
                            <th>Description</th>
                        </tr>

                    </thead>

                    <tbody>

                        <?php foreach ($ownMethods as $method): ?>

                            <?php

                            $parameters = [];

                            foreach ($method->parameters() as $parameter) {

                                $parameterType = $parameter->type();

                                $parameterName = '$' . $parameter->name();

                                $parameterValue =
                                    $parameterType
                                    . ' '
                                    . $parameterName;

                                if ($parameter->isVariadic()) {
                                    $parameterValue =
                                        '...'
                                        . $parameterValue;
                                }

                                if (
                                    $parameter->isOptional()
                                    && $parameter->hasDefault()
                                ) {
                                    $parameterValue .=
                                        ' = '
                                        . var_export(
                                            $parameter->default(),
                                            true
                                        );
                                }

                                $parameters[] = $parameterValue;
                            }

                            $signature =
                                $method->name()
                                . '('
                                . implode(', ', $parameters)
                                . ')';

                            ?>

                            <tr>

                                <td>

                                    <div class="documentation-method-name">

                                        <code>
                                            <?= htmlspecialchars(
                                                $signature
                                            ) ?>
                                        </code>

                                    </div>

                                    <div class="documentation-method-badges">

                                        <?php if ($method->isStatic()): ?>

                                            <span class="documentation-badge">
                                                static
                                            </span>

                                        <?php endif; ?>

                                        <?php if ($method->isFinal()): ?>

                                            <span class="documentation-badge">
                                                final
                                            </span>

                                        <?php endif; ?>

                                        <?php if ($method->isAbstract()): ?>

                                            <span class="documentation-badge documentation-badge-danger">
                                                abstract
                                            </span>

                                        <?php endif; ?>

                                    </div>

                                </td>

                                <td>

                                    <?php if (
                                        $method->description() !== ''
                                    ): ?>

                                        <?= htmlspecialchars(
                                            $method->description()
                                        ) ?>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            No description.
                                        </span>

                                    <?php endif; ?>

                                </td>

                            </tr>

                        <?php endforeach; ?>

                    </tbody>

                </table>

            </div>

        <?php endif; ?>

    </section>

    <?php if (!empty($inheritedMethods)): ?>

        <section class="documentation-section">

            <h2>
                Inherited Methods
            </h2>

            <p class="documentation-muted">
                Methods inherited from the component's parent classes.
            </p>

            <div class="documentation-table-wrapper">

                <table class="documentation-table">

                    <thead>

                        <tr>
                            <th>Method</th>
                            <th>Description</th>
                        </tr>

                    </thead>

                    <tbody>

                        <?php foreach ($inheritedMethods as $method): ?>

                            <?php

                            $parameters = [];

                            foreach ($method->parameters() as $parameter) {

                                $parameterType = $parameter->type();

                                $parameterName = '$' . $parameter->name();

                                $parameterValue =
                                    $parameterType
                                    . ' '
                                    . $parameterName;

                                if ($parameter->isVariadic()) {
                                    $parameterValue =
                                        '...'
                                        . $parameterValue;
                                }

                                if (
                                    $parameter->isOptional()
                                    && $parameter->hasDefault()
                                ) {
                                    $parameterValue .=
                                        ' = '
                                        . var_export(
                                            $parameter->default(),
                                            true
                                        );
                                }

                                $parameters[] = $parameterValue;
                            }

                            $signature =
                                $method->name()
                                . '('
                                . implode(', ', $parameters)
                                . ')';

                            ?>

                            <tr>

                                <td>

                                    <div class="documentation-method-name">

                                        <code>
                                            <?= htmlspecialchars(
                                                $signature
                                            ) ?>
                                        </code>

                                    </div>

                                    <div class="documentation-method-badges">

                                        <span class="documentation-badge">
                                            inherited
                                        </span>

                                        <?php if ($method->isStatic()): ?>

                                            <span class="documentation-badge">
                                                static
                                            </span>

                                        <?php endif; ?>

                                        <?php if ($method->isFinal()): ?>

                                            <span class="documentation-badge">
                                                final
                                            </span>

                                        <?php endif; ?>

                                        <?php if ($method->isAbstract()): ?>

                                            <span class="documentation-badge documentation-badge-danger">
                                                abstract
                                            </span>

                                        <?php endif; ?>

                                    </div>

                                </td>

                                <td>

                                    <?php if (
                                        $method->description() !== ''
                                    ): ?>

                                        <?= htmlspecialchars(
                                            $method->description()
                                        ) ?>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            No description.
                                        </span>

                                    <?php endif; ?>

                                </td>

                            </tr>

                        <?php endforeach; ?>

                    </tbody>

                </table>

            </div>

        </section>

    <?php endif; ?>

    <div class="documentation-navigation">

        <a
            href="/html/docs"
            class="documentation-button"
        >
            ← Back to Components
        </a>

    </div>

</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {

        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

    });
</script>