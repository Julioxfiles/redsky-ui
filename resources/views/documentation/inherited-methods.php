<?php

declare(strict_types=1);

?>

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

                                <?php if ($method->description() !== ''): ?>


                                    <?php echo " - ". htmlspecialchars(
                                        $method->description()
                                    ) ?>

                                <?php else: ?>

                                    <span class="documentation-muted">
                                        No description.
                                    </span>

                                <?php endif; ?>

                            </div>

                        </td>

                        <td>
                            
                        </td>

                    </tr>

                <?php endforeach; ?>

            </tbody>

        </table>

    </div>

</section>

<?php endif; ?>