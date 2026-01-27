# Skynet UI

**Skynet UI** is a PHP frontend interface for interacting with Skynet REST APIs.  
It uses `skynet-core` for core functionality, including helpers, API client, HTTP handling, and reusable utilities.

---

## Features

- **User registration** integrated with `skynet-api`.
- Blade-like template system with:
  - Views and layouts
  - Sections and yields
  - CSRF protection
- Form handling with:
  - Old input repopulation
  - Validation error display
  - Success messages
- Toolbox helper for action buttons (icon-based)
- Dark mode styling for forms and UI elements
- Fully integrated with `skynet-core` helpers and API Client

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Julioxfiles/skynet-ui.git
cd skynet-ui
```

Absolutely! Here's a **full README.md for `skynet-ui`** that complements your `skynet-core` setup and gives a clear overview for GitHub:

````markdown

Install dependencies:

```bash
composer install
```

Make sure `skynet-core` is installed as a dependency:

```bash
composer require skynet/core
```

---

## Usage

### Serve locally

With XAMPP, make sure the `DocumentRoot` points to `skynet-ui/public` or use the built-in PHP server:

```bash
php -S localhost:8000 -t public
```

Visit [http://localhost:8000/register](http://localhost:8000/register) to see the registration form.

### Register a user

The `RegisterController` handles the registration form:

```php
use Core\Http\Client\ApiClient;
use Core\Http\Exceptions\ApiValidationException;

$data = [
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => 'secret',
    'password_confirmation' => 'secret'
];

try {
    $api = new ApiClient();
    $api->post('/auth/register', $data);

    $_SESSION['success'] = 'Account created successfully';

} catch (ApiValidationException $e) {
    $_SESSION['errors'] = $e->errors();
    $_SESSION['old'] = $data;
}
```

---

### Blade-like Templates

```php
<?= view('auth.register', [
    'errors' => $_SESSION['errors'] ?? [],
    'old' => $_SESSION['old'] ?? []
]) ?>
```

In the template:

```php
<form method="POST" action="/register">
    <?= csrf_field() ?>
    <input type="text" name="name" value="<?= e($old['name'] ?? '') ?>">
    <input type="email" name="email" value="<?= e($old['email'] ?? '') ?>">
    <input type="password" name="password">
    <button type="submit">Register</button>
</form>
```

---

### Helpers

* `csrf_field()` → adds CSRF hidden input
* `asset('path/to/file.css')` → generates full URL for assets
* `e($value)` → escapes output for HTML
* `toolbox([...])` → generates action buttons with icons
* `session($key)` → session helper

---

## CSS & Dark Mode

* Forms are centered using `.form-container` and `.center` classes.
* Dark mode is implemented via `style.css` for all inputs, buttons, and containers.

---

## Folder Structure

```
skynet-ui/
├─ app/
│  ├─ Http/
│  │  ├─ Controllers/
│  │  │  └─ Auth/RegisterController.php
├─ core/  (skynet-core dependency)
├─ public/
│  └─ index.php
├─ resources/views/auth/register.php
├─ composer.json
└─ public/css/style.css
```

---

## License

MIT

```

---

If you want, I can also **make a shorter, GitHub-friendly “About” version** for `skynet-ui` like the one we did for `skynet-core`, suitable for the top of the repo page.  

Do you want me to do that too?
```

