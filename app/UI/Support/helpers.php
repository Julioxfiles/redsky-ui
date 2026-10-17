<?php

declare(strict_types=1);

use RedSky\View\Foundation\View;
use RedSky\View\Foundation\ViewBuilder;

if (! function_exists('view')) {

    /**
     * Create a view builder instance or render immediately.
     */
    function view(
        string $name,
        array $data = [],
        ?bool $applyLayout = null
    ): ViewBuilder|string {

        /*
         * Legacy mode:
         *
         * view('partials.footer', [], false)
         *
         * Render immediately without layout.
         */
        if ($applyLayout !== null) {

            return View::make(
                $name,
                $data,
                $applyLayout
            );
        }

        /*
         * Builder mode:
         *
         * view('users.index')
         *      ->with(...)
         *      ->layout(...)
         */
        $builder = new ViewBuilder($name);

        if (! empty($data)) {
            $builder->withData($data);
        }

        return $builder;
    }
}


if (! function_exists('render_view')) {

    /**
     * Render a view immediately.
     */
    function render_view(
        string $name,
        array $data = [],
        bool $applyLayout = true
    ): string {

        return View::make(
            $name,
            $data,
            $applyLayout
        );
    }
}


/*
|--------------------------------------------------------------------------
| Responsabilidad de este archivo
|--------------------------------------------------------------------------
|
| Este archivo contiene los helpers públicos del motor de vistas.
|
| Sus responsabilidades son:
|
| - Crear instancias de ViewBuilder.
| - Permitir el renderizado inmediato de una vista.
| - Exponer una API sencilla para trabajar con vistas.
|
| Este archivo NO debe:
|
| - Resolver componentes UI.
| - Elegir layouts.
| - Seleccionar una biblioteca visual.
| - Tomar decisiones de negocio.
|
| Su única responsabilidad es ofrecer funciones auxiliares para el
| motor redsky-view.
|
*/

use RedSky\Html\Components\Form\Input\Input;
use RedSky\Html\Components\Interactive\Button\Button;
use RedSky\Html\Components\HtmlComponent;

if (!function_exists('component')) {
    /**
     * Render a RedSky HTML component using an array of options.
     *
     * This helper provides a convenient alternative to the
     * recommended fluent PHP component API.
     *
     * @param string $name Component name.
     * @param array<string, mixed> $options Component options.
     *
     * @return string
     *
     * @throws InvalidArgumentException
     */
    function component(
        string $name,
        array $options = []
    ): string {
        $name = strtolower(trim($name));

        $component = match ($name) {
            'input' => new Input(
                (string) ($options['type'] ?? 'text'),
                isset($options['name'])
                    ? (string) $options['name']
                    : null
            ),
            'button' => new Button(
                isset($options['text'])
                    ? (string) $options['text']
                    : null
            ),
            default => throw new InvalidArgumentException(
                sprintf(
                    'Unknown RedSky component "%s".',
                    $name
                )
            ),
        };

        foreach ($options as $key => $value) {
            if (in_array($key, ['type', 'name'], true)) {
                continue;
            }

            if ($name === 'button' && $key === 'text') {
                continue;
            }

            if ($key === 'label') {
                continue;
            }

            if ($key === 'class') {
                if (!is_string($value)) {
                    throw new InvalidArgumentException(
                        'The component class option must be a string.'
                    );
                }

                foreach (
                    preg_split('/\s+/', trim($value)) ?: []
                    as $class
                ) {
                    if ($class !== '') {
                        $component->addClass($class);
                    }
                }

                continue;
            }

            if ($key === 'attributes') {
                if (!is_array($value)) {
                    throw new InvalidArgumentException(
                        'The component attributes option must be an array.'
                    );
                }

                foreach ($value as $attribute => $attributeValue) {
                    if (!is_string($attribute)) {
                        throw new InvalidArgumentException(
                            'HTML attribute names must be strings.'
                        );
                    }

                    $component->addAttribute(
                        $attribute,
                        $attributeValue
                    );
                }

                continue;
            }

            if (!method_exists($component, $key)) {
                throw new InvalidArgumentException(
                    sprintf(
                        'Unsupported option "%s" for component "%s".',
                        $key,
                        $name
                    )
                );
            }

            if (!is_callable([$component, $key])) {
                throw new InvalidArgumentException(
                    sprintf(
                        'Option "%s" is not callable on component "%s".',
                        $key,
                        $name
                    )
                );
            }

            $component->{$key}($value);
        }

        $html = $component->render();

        if ($name === 'input' && !empty($options['label'])) {
            $label = (string) $options['label'];

            $id = $component->getAttribute('id');

            if (!is_string($id) || $id === '') {
                $inputName = $component->getAttribute('name');

                if (!is_string($inputName) || $inputName === '') {
                    throw new InvalidArgumentException(
                        'An input with a label must have an id or name.'
                    );
                }

                $id = $inputName;
                $component->id($id);
                $html = $component->render();
            }

            $html = sprintf(
                '<label for="%s">%s</label>%s',
                htmlspecialchars(
                    $id,
                    ENT_QUOTES | ENT_SUBSTITUTE,
                    'UTF-8'
                ),
                htmlspecialchars(
                    $label,
                    ENT_QUOTES | ENT_SUBSTITUTE,
                    'UTF-8'
                ),
                $html
            );
        }

        return $html;
    }
}