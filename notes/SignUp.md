Perfect 👍
We’ll continue **skynet-ui** as a **pure UI project**, totally separated from **skynet-api**.
For now, the **Register (Sign up)** form will **ONLY render UI + collect data**, **no API call yet**.

I’ll assume your UI project already has:

* A custom router
* A base controller
* A Blade-like view system (`extends`, `section`, `yield`, `@csrf`)
* Session support
* CSRF helper already working (as you mentioned)

---

# 🎯 Goal of this step

Create a **Register (Sign up) flow** in the UI:

1. Route: `/register`
2. Controller: `RegisterController`
3. View: `register.php`
4. CSRF protection
5. Proper form fields
6. Basic UI validation feedback (no API yet)

---

# 1️⃣ Route definition

**File:**
`/routes/web.php`

```php
<?php

use App\Controllers\Auth\RegisterController;

$router->get('/register', [RegisterController::class, 'show']);
$router->post('/register', [RegisterController::class, 'store']);
```

📌 Explanation:

* `GET /register` → shows the form
* `POST /register` → handles form submission (UI only)

---

# 2️⃣ Register Controller

**File:**
`/app/Controllers/Auth/RegisterController.php`

```php
<?php
declare(strict_types=1);

namespace App\Controllers\Auth;

use App\Core\Controller;
use App\Core\Request;

class RegisterController extends Controller
{
    /**
     * Show register form
     */
    public function show(): void
    {
        $this->view('auth/register', [
            'errors' => $_SESSION['errors'] ?? [],
            'old'    => $_SESSION['old'] ?? []
        ]);

        unset($_SESSION['errors'], $_SESSION['old']);
    }

    /**
     * Handle register form submission (UI only)
     */
    public function store(Request $request): void
    {
        $data = $request->all();

        // Save old input for UI repopulation
        $_SESSION['old'] = $data;

        $errors = [];

        if (empty($data['name'])) {
            $errors['name'] = 'Name is required';
        }

        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        }

        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        }

        if (($data['password'] ?? '') !== ($data['password_confirmation'] ?? '')) {
            $errors['password_confirmation'] = 'Passwords do not match';
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $this->redirect('/register');
            return;
        }

        /**
         * 🚧 TEMPORARY
         * Here later we will send data to skynet-api
         */
        $_SESSION['success'] = 'Registration form submitted successfully';

        $this->redirect('/register');
    }
}
```

📌 Important:

* **No database**
* **No API call**
* This controller is **UI validation only**
* Later we will replace the logic with an HTTP client call to `skynet-api`

---

# 3️⃣ Register View

**File:**
`/resources/views/auth/register.php`

```php
@extends('layouts.app')

@section('title', 'Sign Up')

@section('content')

<h2>Create an Account</h2>

@if(session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

<form method="POST" action="/register">

    @csrf

    <div>
        <label for="name">Name</label>
        <input
            type="text"
            name="name"
            id="name"
            value="{{ old('name') }}"
        >
        @error('name')
            <small class="error">{{ $message }}</small>
        @enderror
    </div>

    <div>
        <label for="email">Email</label>
        <input
            type="email"
            name="email"
            id="email"
            value="{{ old('email') }}"
        >
        @error('email')
            <small class="error">{{ $message }}</small>
        @enderror
    </div>

    <div>
        <label for="password">Password</label>
        <input
            type="password"
            name="password"
            id="password"
        >
        @error('password')
            <small class="error">{{ $message }}</small>
        @enderror
    </div>

    <div>
        <label for="password_confirmation">Confirm Password</label>
        <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
        >
        @error('password_confirmation')
            <small class="error">{{ $message }}</small>
        @enderror
    </div>

    <button type="submit">Register</button>

</form>

@endsection
```

---

# 4️⃣ What we have achieved

✅ Clean **Register UI**
✅ CSRF protected
✅ Validation feedback
✅ Old input persistence
✅ Separation of concerns
✅ Ready to connect with `skynet-api`

---

# 5️⃣ What comes next (recommended order)

Next steps I strongly recommend:

1. ✅ Login form → already done
2. 🔜 **HTTP Client in UI (cURL or Guzzle)**
3. 🔜 Send register data to `skynet-api`
4. 🔜 Handle API validation errors
5. 🔜 Store JWT/token in session
6. 🔜 Auth middleware for UI routes

---

If you want, next I can:

* Connect **Register UI → skynet-api**
* Design the **Register endpoint in skynet-api**
* Create a **UI AuthService** (clean architecture)
* Add **flash messages & UI helpers**

Just tell me:
👉 *“Next: connect register to skynet-api”*
