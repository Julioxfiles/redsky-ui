<?php

namespace App\Http\Components;

class Windows
{
    // Incluye CSS/JS necesario para las ventanas
    public static function head(): string
    {
        return '
            <link rel="stylesheet" href="' . asset("css/windows.css") . '?v=' . time() . '">
            <script src="' . asset("js/windows.js") . '?v=' . time() . '"></script>
        ';
    }

    // Devuelve el HTML de una ventana tipo Message Box
    public static function messageBox(array $data, array $buttons): string
    {
        $title = preg_replace("/[ \?\!\$\%\&\/\(\)\=¡¿\{\};,\*\:\.\[\]\d]/", "_", trim($data['title'] ?? ''));
        $msg   = $data['msg'] ?? '';
        $class = $data['class'] ?? '';
        $style = $data['style'] ?? '';
        $type  = $data['type'] ?? 'Info';

        $html = "<div id='{$title}' class='windows-background'>";
        $html .= "<div id='{$title}' class='{$class}' style='{$style}'>";
        $html .= "<div class='windows-title'>{$title}";
        $html .= "<div class='windows-close-icon'><div style='font-size:14px' onclick=\"close_window('{$title}')\">X</div></div>";
        $html .= "</div>";
        $html .= "<div class='windows-message-box-layout'>";
        $html .= "<div class='windows-type'><img src='images/" . self::getWindowImage($type) . "' height='40px' width='40px'></div>";
        $html .= "<span id='message'>{$msg}</span>";
        $html .= "</div>";
        $html .= "<div class='windows-buttons'>";

        foreach ($buttons as $label => $onclick) {
            $html .= "<button type='button' class='btn btn-primary' onclick=\"{$onclick}\">{$label}</button>";
        }

        $html .= "</div>"; // windows-buttons
        $html .= "</div>"; // windows-layout
        $html .= "</div>"; // windows-background

        return $html;
    }

    // Función auxiliar para obtener el icono según el tipo
    private static function getWindowImage(string $type): string
    {
        return match(strtolower($type)) {
            'wait', 'espere'      => 'icon_loading.gif',
            'question', 'pregunta'=> 'icon_question.png',
            'info', 'informacion' => 'icon_info.png',
            'warning', 'advertencia', 'alert', 'alerta' => 'icon_alert.png',
            'success'             => 'icon_success.png',
            'input', 'entrada', 'password', 'clave' => 'icon_input.png',
            'error'               => 'icon_error.png',
            'loading', 'cargando' => 'icon_loading.gif',
            'save', 'grabar'      => 'icon_save.png',
            'exit'                => 'icon_exit.png',
            'next', 'siguiente'   => 'icon_next_green_arrow.png',
            'download', 'descargar'=> 'icon_download.png',
            'burn', 'quemar'      => 'icon_burn_cd.png',
            'recycle', 'reciclar' => 'icon_recycle.png',
            'mail', 'email'       => 'icon_email_blue.png',
            'geolocation', 'geolocalizacion' => 'geolocating.gif',
            default                => 'icon_info.png'
        };
    }

    // Aquí puedes agregar más métodos como inputBox(), alertBox(), noteBox(), window(), etc.
    // Todos deben retornar HTML en vez de hacer echo
}