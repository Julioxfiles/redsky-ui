<?php

$component = $component ?? null;

if ($component === null) {
    return;
}

$methods = $component->methods();
$properties = $component->properties();

$examples = method_exists($component, 'examples')
    ? $component->examples()
    : [];

?>

<div class="documentation">

    <!-- =========================================================
         Component Header
    ========================================================== -->

    <header class="documentation-header">

        <div class="documentation-breadcrumb">
            HTML Components
            <span>/</span>
            <?= htmlspecialchars($component->category() ?? 'General') ?>
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


    <!-- =========================================================
         Purpose
    ========================================================== -->

    <section class="documentation-section">

        <h2>
            About this component
        </h2>

        <div class="documentation-card">

            <?php if ($component->description() !== null): ?>

                <p>
                    <?= htmlspecialchars($component->description()) ?>
                </p>

            <?php else: ?>

                <p class="documentation-muted">
                    No additional description is available.
                </p>

            <?php endif; ?>

        </div>

    </section>


    <!-- =========================================================
         Examples
    ========================================================== -->

    <?php if (!empty($examples)): ?>

        <section class="documentation-section">

            <h2>
                Usage
            </h2>

            <?php foreach ($examples as $example): ?>

                <div class="documentation-example">

                    <?php if (is_array($example)): ?>

                        <?php if (isset($example['title'])): ?>

                            <h3>
                                <?= htmlspecialchars($example['title']) ?>
                            </h3>

                        <?php endif; ?>

                        <?php if (isset($example['description'])): ?>

                            <p>
                                <?= htmlspecialchars(
                                    $example['description']
                                ) ?>
                            </p>

                        <?php endif; ?>

                        <?php if (isset($example['code'])): ?>

                            <pre><code><?= htmlspecialchars(
                                $example['code']
                            ) ?></code></pre>

                        <?php endif; ?>

                    <?php else: ?>

                        <pre><code><?= htmlspecialchars(
                            (string) $example
                        ) ?></code></pre>

                    <?php endif; ?>

                </div>

            <?php endforeach; ?>

        </section>

    <?php endif; ?>


    <!-- =========================================================
         Component Information
    ========================================================== -->

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
                        <?= htmlspecialchars($component->class()) ?>
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


    <!-- =========================================================
         Methods
    ========================================================== -->

    <section class="documentation-section">

        <h2>
            Methods
        </h2>

        <?php if (empty($methods)): ?>

            <div class="documentation-alert">
                No methods documented.
            </div>

        <?php else: ?>

            <div class="documentation-table-wrapper">

                <table class="documentation-table">

                    <thead>

                        <tr>

                            <th>
                                Method
                            </th>

                            <th>
                                Parameters
                            </th>

                            <th>
                                Returns
                            </th>

                            <th>
                                Description
                            </th>

                            <th>
                                Declared By
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <?php foreach ($methods as $method): ?>

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

                                        <?php if ($method->isInherited()): ?>

                                            <span class="documentation-badge">
                                                inherited
                                            </span>

                                        <?php endif; ?>


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

                                                    <span>
                                                        :
                                                    </span>

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


    <!-- =========================================================
         Properties
    ========================================================== -->

    <section class="documentation-section documentation-advanced">

        <h2>
            Properties
        </h2>

        <p class="documentation-muted">
            Internal class properties and implementation details.
        </p>

        <?php if (empty($properties)): ?>

            <div class="documentation-alert">
                No properties documented.
            </div>

        <?php else: ?>

            <div class="documentation-table-wrapper">

                <table class="documentation-table">

                    <thead>

                        <tr>

                            <th>
                                Property
                            </th>

                            <th>
                                Type
                            </th>

                            <th>
                                Visibility
                            </th>

                            <th>
                                Declared By
                            </th>

                            <th>
                                Default
                            </th>

                            <th>
                                Modifiers
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <?php foreach ($properties as $property): ?>

                            <tr>

                                <td>

                                    <code>
                                        <?= htmlspecialchars(
                                            $property->name()
                                        ) ?>
                                    </code>

                                </td>


                                <td>

                                    <code>
                                        <?= htmlspecialchars(
                                            $property->type()
                                        ) ?>
                                    </code>

                                </td>


                                <td>

                                    <?= htmlspecialchars(
                                        $property->visibility()
                                    ) ?>

                                </td>


                                <td>

                                    <?php if (
                                        $property->declaringClass() !== null
                                    ): ?>

                                        <code>
                                            <?= htmlspecialchars(
                                                $property->declaringClass()
                                            ) ?>
                                        </code>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            Unknown
                                        </span>

                                    <?php endif; ?>

                                </td>


                                <td>

                                    <?php if (
                                        $property->hasDefault()
                                    ): ?>

                                        <code>
                                            <?= htmlspecialchars(
                                                var_export(
                                                    $property->default(),
                                                    true
                                                )
                                            ) ?>
                                        </code>

                                    <?php else: ?>

                                        <span class="documentation-muted">
                                            None
                                        </span>

                                    <?php endif; ?>

                                </td>


                                <td>

                                    <?php if ($property->isInherited()): ?>

                                        <span class="documentation-badge">
                                            inherited
                                        </span>

                                    <?php endif; ?>


                                    <?php if ($property->isStatic()): ?>

                                        <span class="documentation-badge">
                                            static
                                        </span>

                                    <?php endif; ?>


                                    <?php if ($property->isReadonly()): ?>

                                        <span class="documentation-badge">
                                            readonly
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


    <!-- =========================================================
         Navigation
    ========================================================== -->

    <div class="documentation-navigation">

        <a
            href="/html/docs"
            class="documentation-button"
        >
            ← Back to Components
        </a>

    </div>

</div>