<h2>{{ $title }}</h2>

<form method="POST" action="/login">
    @csrf

    <input type="email" name="email">
    <input type="password" name="password">

    <button>Login</button>
</form>
