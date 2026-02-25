@extends('layouts.app')

@section('title')
Register
@endsection

@section('content')
<h4>Register</h4>

<div class="form-container">
 <form class="form center" method="POST" action="/register">
    @csrf

    <input type="text" name="name" placeholder='Name' value="<?= e($old['name'] ?? '') ?>">
    @if(isset($errors['name']))
        <span class="text-red-600">{{ $errors['name'] }}</span>
    @endif
    <br>

    <input type="email" name="email" placeholder="Email" value="<?= e($old['email'] ?? '') ?>">
    @if(isset($errors['email']))
        <span class="text-red-600">{{ $errors['email'] }}</span>
    @endif
    <br>

    <input class='dark' type="password" name="password" placeholder="Password">
    @if(isset($errors['password']))
        <span class="text-red-600">{{ $errors['password'] }}</span>
    @endif
    <br>

    <input class='dark' type="password" name="password_confirmation" placeholder="Confirm password">
    @if(isset($errors['password_confirmation']))
        <span class="text-red-600">{{ $errors['password_confirmation'] }}</span>
    @endif
    <br>

    <button type="submit">Register</button>
 </form>

</div>

@endsection

