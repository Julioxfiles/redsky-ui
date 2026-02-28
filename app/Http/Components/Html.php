<?php
declare(strict_types=1);

namespace App\Http\Components;

final class Html
{
    /**
     * Convierte un array de atributos en string HTML
     */
    protected static function attributes(array $attributes): string
    {
        $html = '';

        foreach ($attributes as $key => $value) {
            if ($value === false || $value === null) continue;
            if ($value === true) {
                $html .= ' ' . htmlspecialchars($key);
                continue;
            }
            $html .= sprintf(' %s="%s"', htmlspecialchars($key), htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'));
        }

        return $html;
    }

    /**
     * Renderiza una tarjeta de Bootstrap
     *
     * Config array:
     * - title: string (opcional)
     * - text: string (opcional)
     * - image: string URL (opcional)
     * - imageAlt: string (opcional)
     * - footer: string HTML opcional
     * - buttons: array de botones [['text'=>'', 'href'=>'', 'class'=>'']] (opcional)
     * - class: clases CSS extra para el div.card
     */
    public static function card(array $config = []): string
    {
        $title = $config['title'] ?? '';
        $text  = $config['text'] ?? '';
        $image = $config['image'] ?? '';
        $imageAlt = $config['imageAlt'] ?? '';
        $footer = $config['footer'] ?? '';
        $buttons = $config['buttons'] ?? [];
        $class = $config['class'] ?? '';

        $html = '<div class="card ' . htmlspecialchars($class) . '">';

        if ($image) {
            $html .= sprintf(
                '<img src="%s" class="card-img-top" alt="%s">',
                htmlspecialchars($image, ENT_QUOTES),
                htmlspecialchars($imageAlt, ENT_QUOTES)
            );
        }

        if ($title || $text || !empty($buttons)) {
            $html .= '<div class="card-body">';
            if ($title) {
                $html .= '<h5 class="card-title">' . htmlspecialchars($title) . '</h5>';
            }
            if ($text) {
                $html .= '<p class="card-text">' . htmlspecialchars($text) . '</p>';
            }
            if (!empty($buttons)) {
                foreach ($buttons as $btn) {
                    $btnText  = $btn['text'] ?? '';
                    $btnHref  = $btn['href'] ?? '#';
                    $btnClass = $btn['class'] ?? 'btn btn-primary';

                    $html .= sprintf(
                        '<a href="%s" class="%s">%s</a> ',
                        htmlspecialchars($btnHref, ENT_QUOTES),
                        htmlspecialchars($btnClass, ENT_QUOTES),
                        htmlspecialchars($btnText)
                    );
                }
            }
            $html .= '</div>'; // cierre card-body
        }

        if ($footer) {
            $html .= '<div class="card-footer">' . $footer . '</div>';
        }

        $html .= '</div>'; // cierre card

        return $html;
    }
}