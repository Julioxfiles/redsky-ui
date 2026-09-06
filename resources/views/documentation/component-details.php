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
    .documentation-section h2 {
        color: #7dd3fc;
    }

    .documentation-example {
        margin-bottom: 2rem;
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
    }

    .documentation-example-output {
        margin-top: 1rem;
    }

    .documentation-example-output-title {
        margin-bottom: 0.75rem;
        font-weight: 600;
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

        <div class="documentation-breadcrumb">
            HTML Components
            <span>/</span>
            <?= htmlspecialchars(
                $component->category() ?? 'General'
            ) ?>
        </div>

        <h1 class="documentation-title">
            <?= htmlspecialchars($component->name()) ?>
        </h1>

        <?php if ($component->description() !== null): ?>

            <p class="documentation-description">
                <?= htmlspecialchars($component->description()) ?>
            </p>

        <?php endif; ?>

        <div class="documentation-meta">

            <?php if ($component->category() !== null): ?>

                <span class="documentation-badge">
                    <?= htmlspecialchars($component->category()) ?>
                </span>

            <?php endif; ?>

            <?php if ($component->version() !== null): ?>

                <span class="documentation-meta-item">
                    Version:
                    <code>
                        <?= htmlspecialchars($component->version()) ?>
                    </code>
                </span>

            <?php endif; ?>

            <?php if ($component->isDeprecated()): ?>

                <span class="documentation-badge documentation-badge-danger">
                    Deprecated
                </span>

            <?php endif; ?>

        </div>

    </header>


    <section class="documentation-section">

        <h2>
            Description
        </h2>

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

            <p class="documentation-muted">
                The following examples demonstrate how to use this
                component, the source code involved, and the resulting
                HTML output.
            </p>


            <?php foreach ($examples as $example): ?>

                <div class="documentation-example documentation-card">

                    <?php if ($example->title() !== ''): ?>

                        <h3>
                            <?= htmlspecialchars(
                                $example->title()
                            ) ?>
                        </h3>

                    <?php endif; ?>


                    <?php if ($example->hasDescription()): ?>

                        <p class="documentation-example-description">
                            <?= nl2br(
                                htmlspecialchars(
                                    $example->description()
                                )
                            ) ?>
                        </p>

                    <?php endif; ?>


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
                                    ? 'PHP Source'
                                    : 'Source'
                                ?>
                            </div>

                            <pre class="language-<?= htmlspecialchars($language) ?>"><code class="language-<?= htmlspecialchars($language) ?>"><?= htmlspecialchars(
                                $example->code()
                            ) ?></code></pre>

                        </div>


                        <?php if ($language === 'php'): ?>

                            <?php

                            $phpCode = $example->code();

                            /*
                             * The example metadata currently stores the
                             * PHP source code. The rendered HTML is stored
                             * separately in output().
                             *
                             * When the output contains HTML, display that
                             * HTML source separately for inspection.
                             */

                            $htmlOutput = method_exists(
                                $example,
                                'output'
                            )
                                ? $example->output()
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


                    <?php if (
                        method_exists($example, 'hasOutput')
                        && $example->hasOutput()
                    ): ?>

                        <div class="documentation-example-output">

                            <div class="documentation-example-output-title">
                                Rendered Output
                            </div>

                            
                                <?= $example->output() ?>

                            

                        </div>

                    <?php endif; ?>

                </div>

            <?php endforeach; ?>

        </section>

    <?php endif; ?>


    <section class="documentation-section">

        <h2>
            Component Information
        </h2>

        <div class="documentation-card">

            <dl class="documentation-info">

                <dt>
                    Class
                </dt>

                <dd>
                    <code>
                        <?= htmlspecialchars(
                            $component->class()
                        ) ?>
                    </code>
                </dd>


                <dt>
                    Category
                </dt>

                <dd>
                    <?= htmlspecialchars(
                        $component->category() ?? 'None'
                    ) ?>
                </dd>


                <dt>
                    Version
                </dt>

                <dd>
                    <?= htmlspecialchars(
                        $component->version() ?? 'Not specified'
                    ) ?>
                </dd>


                <dt>
                    Deprecated
                </dt>

                <dd>

                    <?php if ($component->isDeprecated()): ?>

                        <span class="documentation-badge documentation-badge-danger">
                            Yes
                        </span>

                    <?php else: ?>

                        <span class="documentation-badge documentation-badge-success">
                            No
                        </span>

                    <?php endif; ?>

                </dd>

            </dl>

        </div>

    </section>


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
                            <th>Parameters</th>
                            <th>Returns</th>
                            <th>Description</th>
                            <th>Declared By</th>
                        </tr>

                    </thead>

                    <tbody>

                        <?php foreach ($ownMethods as $method): ?>

                            <tr>

                                <td>

                                    <div class="documentation-method-name">

                                        <code>
                                            <?= htmlspecialchars(
                                                $method->name()
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

                                    <?php if ($method->hasParameters()): ?>

                                        <ul class="documentation-parameters">

                                            <?php foreach (
                                                $method->parameters()
                                                as $parameter
                                            ): ?>

                                                <li>

                                                    <code>
                                                        <?= htmlspecialchars(
                                                            $parameter->name()
                                                        ) ?>
                                                    </code>

                                                    :

                                                    <code>
                                                        <?= htmlspecialchars(
                                                            $parameter->type()
                                                        ) ?>
                                                    </code>

                                                    <?php if (
                                                        $parameter->isOptional()
                                                    ): ?>

                                                        <span class="documentation-muted">
                                                            optional
                                                        </span>

                                                    <?php endif; ?>

                                                    <?php if (
                                                        $parameter->isVariadic()
                                                    ): ?>

                                                        <span class="documentation-muted">
                                                            variadic
                                                        </span>

                                                    <?php endif; ?>

                                                    <?php if (
                                                        $parameter->hasDefault()
                                                    ): ?>

                                                        <span class="documentation-muted">
                                                            =
                                                            <?= htmlspecialchars(
                                                                var_export(
                                                                    $parameter->default(),
                                                                    true
                                                                )
                                                            ) ?>
                                                        </span>

                                                    <?php endif; ?>

                                                </li>

                                            <?php endforeach; ?>

                                        </ul>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            None
                                        </span>

                                    <?php endif; ?>

                                </td>


                                <td>

                                    <code>
                                        <?= htmlspecialchars(
                                            $method->returnType()
                                        ) ?>
                                    </code>

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


                                <td>

                                    <?php if (
                                        $method->declaringClass() !== null
                                    ): ?>

                                        <code>
                                            <?= htmlspecialchars(
                                                $method->declaringClass()
                                            ) ?>
                                        </code>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            Unknown
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
                            <th>Parameters</th>
                            <th>Returns</th>
                            <th>Description</th>
                            <th>Declared By</th>
                        </tr>

                    </thead>

                    <tbody>

                        <?php foreach ($inheritedMethods as $method): ?>

                            <tr>

                                <td>

                                    <div class="documentation-method-name">

                                        <code>
                                            <?= htmlspecialchars(
                                                $method->name()
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

                                    <?php if ($method->hasParameters()): ?>

                                        <ul class="documentation-parameters">

                                            <?php foreach (
                                                $method->parameters()
                                                as $parameter
                                            ): ?>

                                                <li>

                                                    <code>
                                                        <?= htmlspecialchars(
                                                            $parameter->name()
                                                        ) ?>
                                                    </code>

                                                    :

                                                    <code>
                                                        <?= htmlspecialchars(
                                                            $parameter->type()
                                                        ) ?>
                                                    </code>

                                                    <?php if (
                                                        $parameter->isOptional()
                                                    ): ?>

                                                        <span class="documentation-muted">
                                                            optional
                                                        </span>

                                                    <?php endif; ?>

                                                    <?php if (
                                                        $parameter->isVariadic()
                                                    ): ?>

                                                        <span class="documentation-muted">
                                                            variadic
                                                        </span>

                                                    <?php endif; ?>

                                                    <?php if (
                                                        $parameter->hasDefault()
                                                    ): ?>

                                                        <span class="documentation-muted">
                                                            =
                                                            <?= htmlspecialchars(
                                                                var_export(
                                                                    $parameter->default(),
                                                                    true
                                                                )
                                                            ) ?>
                                                        </span>

                                                    <?php endif; ?>

                                                </li>

                                            <?php endforeach; ?>

                                        </ul>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            None
                                        </span>

                                    <?php endif; ?>

                                </td>


                                <td>

                                    <code>
                                        <?= htmlspecialchars(
                                            $method->returnType()
                                        ) ?>
                                    </code>

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


                                <td>

                                    <?php if (
                                        $method->declaringClass() !== null
                                    ): ?>

                                        <code>
                                            <?= htmlspecialchars(
                                                $method->declaringClass()
                                            ) ?>
                                        </code>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            Unknown
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