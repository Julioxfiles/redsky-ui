@extends('layouts.app')

@section('title', 'Usuarios')

@section('content')

<?php
use App\Http\Components\Windows;

$data = [
    'title' => 'Aviso Importante',         // Título de la ventana
    'msg'   => 'Este es un mensaje de prueba para la ventana.', // Mensaje
    'type'  => 'Info',                     // Tipo (para iconos o estilos)
    'class' => 'my-window-class',          // Clase opcional para personalizar
    'style' => 'width:400px;height:auto;padding:10px;' // Tamaño y padding
];

$buttons = [
    'Aceptar' => "close_window('Aviso_Importante')",
    'Cancelar' => "console.log('Cancelado')"
];

$windowHtml = Windows::messageBox($data, $buttons);

echo  $windowHtml;


?>

@endsection