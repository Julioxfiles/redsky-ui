<?php $title = 'Register'; ?>

<h4>Create account</h4>

<form action="<?= url('/register') ?>" method="POST">

    <?= component('input', [
        'type' => 'email',
        'name' => 'email',
        'label' => 'Email address',
        'placeholder' => 'Enter your email',
        'attributes' => [
            'required' => true,
            'autocomplete' => 'email'
        ]
    ]) ?>

    <?= component('input', [
        'type' => 'password',
        'name' => 'password',
        'label' => 'Password',
        'placeholder' => 'Enter your password',
        'attributes' => [
            'required' => true,
            'autocomplete' => 'new-password'
        ]
    ]) ?>

    <?= component('input', [
        'type' => 'password',
        'name' => 'password_confirmation',
        'label' => 'Confirm password',
        'placeholder' => 'Repeat your password',
        'attributes' => [
            'required' => true,
            'autocomplete' => 'new-password'
        ]
    ]) ?>

    <?= component('button', [
        'type' => 'submit',
        'class' => 'btn btn-primary',
        'text' => 'Create account'
    ]) ?>

</form>

<p style="margin-top: 10px;">
    Already have an account?
    <a href="<?= url('/login') ?>">Login</a>
</p>