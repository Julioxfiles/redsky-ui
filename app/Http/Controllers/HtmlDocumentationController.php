<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use RedSky\Html\Documentation\Documentation;

class HtmlDocumentationController
{
    public function index(): mixed
    {
        $documentation = new Documentation();

        return view('documentation.index', [
            'components' => $documentation->components(),
        ]);
    }

    public function show(string $component): mixed
    {
        $documentation = new Documentation();

        $data = $documentation->findByName($component);

        if ($data === null) {
            return view('documentation.not-found', [
                'component' => $component,
            ]);
        }

        return view('documentation.component-details', [
            'component' => $data,
        ]);
    }
}