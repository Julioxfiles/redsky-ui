<?php

declare(strict_types=1);

use RedSky\Html\Components\Form\UrlInput\UrlInput;

/**
 * UrlInput component examples.
 *
 * Demonstrates basic URL input, required fields, initial values,
 * autocomplete, and disabled and readonly states.
 */
?>

<section>
    <h2>Basic URL Input</h2>

    <?php
    echo (new UrlInput('website'))
        ->placeholder('https://example.com');
    ?>
</section>

<section>
    <h2>Required URL Input</h2>

    <?php
    echo (new UrlInput('company_website'))
        ->placeholder('Enter your company website')
        ->required();
    ?>
</section>

<section>
    <h2>URL Input with Initial Value</h2>

    <?php
    echo (new UrlInput('portfolio'))
        ->value('https://example.com/portfolio');
    ?>
</section>

<section>
    <h2>URL Input with Autocomplete</h2>

    <?php
    echo (new UrlInput('personal_website'))
        ->placeholder('Enter your personal website')
        ->autocomplete('url');
    ?>
</section>

<section>
    <h2>Readonly URL Input</h2>

    <?php
    echo (new UrlInput('readonly_website'))
        ->value('https://example.com')
        ->readonly();
    ?>
</section>

<section>
    <h2>Disabled URL Input</h2>

    <?php
    echo (new UrlInput('disabled_website'))
        ->value('https://example.com')
        ->disabled();
    ?>
</section>
