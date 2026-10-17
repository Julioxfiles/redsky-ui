<?php

declare(strict_types=1);

use RedSky\Html\Components\Form\TextInput\TextInput;
use RedSky\Html\Components\Form\EmailInput\EmailInput;
use RedSky\Html\Components\Form\PasswordInput\PasswordInput;
use RedSky\Html\Components\Form\DateInput\DateInput;
use RedSky\Html\Components\Interactive\Button\Button;

$firstName = (new TextInput('first_name'))
    ->id('first-name')
    ->placeholder('Tu nombre')
    ->autocomplete('given-name')
    ->required()
    ->addClass('form-control');

$lastName = (new TextInput('last_name'))
    ->id('last-name')
    ->placeholder('Tus apellidos')
    ->autocomplete('family-name')
    ->required()
    ->addClass('form-control');

$birthDate = (new DateInput('birth_date'))
    ->id('birth-date')
    ->required()
    ->addClass('form-control');

$email = (new EmailInput('email'))
    ->id('email')
    ->placeholder('nombre@ejemplo.com')
    ->autocomplete('email')
    ->required()
    ->addClass('form-control');

$password = (new PasswordInput('password'))
    ->id('password')
    ->placeholder('Crea una contraseña')
    ->autocomplete('new-password')
    ->minlength(8)
    ->required()
    ->addClass('form-control');

$passwordConfirmation = (new PasswordInput('password_confirmation'))
    ->id('password-confirmation')
    ->placeholder('Repite tu contraseña')
    ->autocomplete('new-password')
    ->minlength(8)
    ->required()
    ->addClass('form-control');

$submitButton = (new Button('Crear cuenta'))
    ->type('submit')
    ->addClass('btn')
    ->addClass('btn-primary')
    ->addClass('register-submit');
?>

<section class="register-page">
    <div class="register-card">

        <header class="register-header">
            <h1>Crear cuenta</h1>
            <p>Completa tus datos para comenzar.</p>
        </header>

        <form
            action="/register"
            method="POST"
            autocomplete="on"
            class="form register-form"
        >
            <div class="row g-3">

                <div class="col-md-6">
                    <label for="first-name" class="form-label">
                        Nombre
                    </label>
                    <?= $firstName->render() ?>
                </div>

                <div class="col-md-6">
                    <label for="last-name" class="form-label">
                        Apellidos
                    </label>
                    <?= $lastName->render() ?>
                </div>

                <div class="col-md-6">
                    <label for="birth-date" class="form-label">
                        Fecha de nacimiento
                    </label>
                    <?= $birthDate->render() ?>
                </div>

                <div class="col-12">
                    <label for="email" class="form-label">
                        Correo electrónico
                    </label>
                    <?= $email->render() ?>
                </div>

                <div class="col-md-6">
                    <label for="password" class="form-label">
                        Contraseña
                    </label>
                    <?= $password->render() ?>

                    <div class="form-text">
                        Usa al menos 8 caracteres.
                    </div>
                </div>

                <div class="col-md-6">
                    <label
                        for="password-confirmation"
                        class="form-label"
                    >
                        Confirmar contraseña
                    </label>
                    <?= $passwordConfirmation->render() ?>
                </div>

            </div>

            <div class="register-actions">
                <?= $submitButton->render() ?>
            </div>

            <p class="register-footer">
                ¿Ya tienes una cuenta?
                <a href="/login">Inicia sesión</a>
            </p>
        </form>

    </div>
</section>