@extends('layouts.app')

@section('title')
Register
@endsection

@section('content')
<h1>Register</h1>
<h2>Create an Account</h2>

<form method="POST" action="/register">
    @csrf

    <div>
        <label>Name</label>
        <input type="text" name="name">
    </div>

    <button type="submit">Register</button>
</form>
@endsection

