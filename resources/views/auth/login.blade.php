@extends('layouts.app')

@section('title')
Login
@endsection

@section('content')
<h4>Login</h4>

<div class="form-container">
 <form class="form center" method="POST" action="/login">
    @csrf

    <input type="email" name="email" placeholder="Email" value="<?= e($old['email'] ?? '') ?>">
    @if(isset($errors['email']))
        <span class="text-red-600">{{ $errors['email'] }}</span>
    @endif
    <br>

    <input class="dark" type="password" name="password" placeholder="Password">
    @if(isset($errors['password']))
        <span class="text-red-600">{{ $errors['password'] }}</span>
    @endif
    <br>

    <button type="submit" class="btn orangered">Login</button>
 </form>
</div>

@endsection