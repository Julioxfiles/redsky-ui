<?php

declare(strict_types=1);

namespace RedSky\Html\Components\Form\UrlInput;


use RedSky\Html\Components\Form\Input\Input;

/**
 * Represents an HTML URL input component.
 *
 * The UrlInput component generates a semantic HTML
 * <input type="url"> element for entering web addresses
 * and other URL values.
 *
 *
 * @package RedSky\Html\Components\Form
 */
class UrlInput extends Input
{
    /**
     * Creates a new URL input component.
     *
     * The input type is automatically set to `url`.
     *
     * @param string|null $name Input name.
     */
    public function __construct(
        ?string $name = null
    ) {
        parent::__construct(
            'url',
            $name
        );

        $this->addAttribute('data-redsky-component', 'url-input');
    }
}