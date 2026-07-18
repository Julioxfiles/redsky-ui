<?php

use RedSky\Bootstrap\Components\Button;
use RedSky\Bootstrap\Components\Card;

echo $title;

echo Button::make([
    'text' => 'Guardar usuario',
    'type' => 'primary',
]);

echo Card::make([
    'title' => 'Usuarios',
    'content' => 'Contenido del card',
]);

?>
