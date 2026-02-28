@extends('layouts.app')

@section('title')
Usuarios
@endsection

@section('content')

<h2>Listado de usuarios</h2>

<ul>
@foreach($users as $user)
    <li><?= htmlspecialchars($user['name'] ?? '', ENT_QUOTES, 'UTF-8') ?></li>
@endforeach
</ul>

@once('welcome')
    <div class="alert">¡Bienvenido!</div>
@endonce

<div class="alert alert-success">
    ¡Bienvenido!
</div>

<div class="alert alert-warning">
    Este es un mensaje de advertencia.
</div>

<?= form::text([
    'name' => 'username',
    'class' => 'form-control',
    'placeholder' => 'Nombre de usuario'
]) ?>

<?= form::email([
    'name' => 'email',
    'class' => 'form-control',
    'placeholder' => 'Correo electrónico'
]) ?>

<?= form::submit([
    'text' => 'Guardar',
    'class' => 'btn btn-primary'
]) ?>

<?php
echo html::card([
    'title' => 'Mi tarjeta',
    'text'  => 'Este es el contenido de la tarjeta.',
    'image' => 'https://via.placeholder.com/150',
    'buttons' => [
        ['text' => 'Ver más', 'href' => '#', 'class' => 'btn btn-primary'],
        ['text' => 'Cancelar', 'href' => '#', 'class' => 'btn btn-secondary'],
    ],
    'footer' => 'Pie de la tarjeta',
    'class'  => 'mb-3'
]);
?>

@endsection