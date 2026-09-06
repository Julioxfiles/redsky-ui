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

$examples = method_exists($component, 'examples')
    ? $component->examples()
    : [];

?>

<style>
    .documentation-title {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: aqua;
    }

    .documentation-title code {
        font-family:  "Courier New", monospace;
        font-size: 1.5rem;
        font-weight: 0;
        color:cornflowerblue;

    }

    .documentation-section h2 {
        color: cornflowerblue;
    }

    .documentation-example {
        margin-bottom: 1rem;
    }

    .documentation-example-description {
        margin-bottom: 1rem;
    }

    .documentation-example-code {
        margin-bottom: 1rem;
        
    }

    .documentation-example-code-title {
        margin-bottom: 0.75rem;
        font-weight: 600;
        color:aqua;
    }

    .documentation-example-output {
        margin-top: 1rem;       
        
    }

    .documentation-example-component-rendered {
        margin-top: 1rem;
        padding: 1.5rem;
        border: 1px solid #374151;
        border-radius: 0.5rem;
        background: #121212;
        color:cornflowerblue;
        width: 300px;
    }

    .documentation-example-output-title {
        margin-bottom: 0.75rem;
        font-weight: 600;
        color:aqua;
        
    }

    .documentation-method-name code {
        font-family: "Courier New", monospace;
        font-size: 1rem;
        font-weight: 500;
        color:aqua;
    }

    .documentation-table th,
    .documentation-table td {
        padding: 5px 10px;
    }

    .documentation-example-preview {
        padding: 1.5rem;
        border: 1px solid #374151;
        border-radius: 0.5rem;
        background: #ffffff;
    }

    .documentation-example-preview input,
    .documentation-example-preview textarea,
    .documentation-example-preview select,
    .documentation-example-preview button {
        max-width: 100%;
    }

    pre[class*="language-"] {
        margin: 0 0 1rem 0;
        border-radius: 0.5rem;
    }

    code[class*="language-"],
    pre[class*="language-"] {
        font-family:
            Consolas,
            Monaco,
            "Andale Mono",
            "Ubuntu Mono",
            monospace;
        font-size: 0.9rem;
    }
</style>

<div class="documentation">

    <header class="documentation-header">

        <h1 class="documentation-title">
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
                Example
            </h2>

            <?php foreach ($examples as $example): ?>

                <div class="documentation-example documentation-card">

                    <?php if ($example->code() !== ''): ?>

                        <?php

                        $language = $example->language();

                        if (
                            $language === null
                            || $language === ''
                        ) {
                            $language = 'php';
                        }

                        $language = strtolower($language);

                        $allowedLanguages = [
                            'php',
                            'html',
                            'markup',
                            'css',
                            'javascript',
                            'js',
                            'json',
                            'bash',
                            'sql',
                            'text',
                        ];

                        if (
                            !in_array(
                                $language,
                                $allowedLanguages,
                                true
                            )
                        ) {
                            $language = 'text';
                        }

                        if ($language === 'html') {
                            $language = 'markup';
                        }

                        if ($language === 'js') {
                            $language = 'javascript';
                        }

                        ?>

                        <div class="documentation-example-code">

                            <div class="documentation-example-code-title">
                                <?= $language === 'php'
                                    ? 'PHP'
                                    : 'Source'
                                ?>
                            </div>

                            <pre class="language-<?= htmlspecialchars($language) ?>"><code class="language-<?= htmlspecialchars($language) ?>"><?= htmlspecialchars(
                                $example->code()
                            ) ?></code></pre>

                        </div>

                        <?php if ($language === 'php'): ?>

                            <?php

                            $htmlOutput = method_exists(
                            $example,
                            'formattedOutput'
                        )
                            ? $example->formattedOutput()
                            : null;

                            ?>

                            <?php if (
                                $htmlOutput !== null
                                && $htmlOutput !== ''
                            ): ?>

                                <div class="documentation-example-code">

                                    <div class="documentation-example-code-title">
                                        HTML Output
                                    </div>

                                    <pre class="language-markup"><code class="language-markup"><?= htmlspecialchars(
                                        $htmlOutput
                                    ) ?></code></pre>

                                </div>

                            <?php endif; ?>

                        <?php endif; ?>

                    <?php endif; ?>

                    <?php if (method_exists($example, 'hasOutput')
                             && $example->hasOutput()
                    ): ?>

                        <div class="documentation-example-output">

                            <div class="documentation-example-code-title">
                                Component Rendered
                            </div>

                            <div class="documentation-example-component-rendered">
                              <?= $example->output(); ?>
                            </div>

                        </div>

                    <?php endif; ?>

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