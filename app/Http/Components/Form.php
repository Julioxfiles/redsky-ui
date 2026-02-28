<?php
declare(strict_types=1);

namespace App\Http\Components;

use InvalidArgumentException;

/**
* Inputs
* input()
* text()
* email()
* password()
* url()
* tel()
* textarea()
* select()
* Choice controls
* checkBox()
* checkBoxGroup()
* radio()
* radioGroup()
* Buttons
* button()
* submit() (added)
* reset() (added)
* Forms
* open()
* close()
* csrf()
* Validation & UX
* old()
* hasError()
* error()
* errors()
 */
final class Form
{
    /* -------------------------------------------------
     | Core helpers
     * ------------------------------------------------- */
    /**
     * Converts an associative array of HTML attributes into a safe HTML string.
     *
     * - Skips attributes with `false` or `null` values
     * - Renders boolean attributes (`true`) without a value (e.g. `required`, `disabled`)
     * - Escapes attribute names and values to prevent XSS
     *
     * This method is the foundation of all HTML output in this helper.
     *
     * Example:
     * ```php
     * Form::attributes([
     *     'class'    => 'form-control',
     *     'required' => true,
     *     'disabled' => false,
     *     'value'    => 'John Doe',
     * ]);
     * ```
     *
     * Output:
     * ```html
     *  class="form-control" required value="John Doe"
     * ```
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    protected static function attributes(array $attributes): string
    {
        $html = '';

        foreach ($attributes as $key => $value) {
            if ($value === false || $value === null) {
                continue;
            }

            if ($value === true) {
                $html .= ' ' . htmlspecialchars($key);
                continue;
            }

            $html .= sprintf(
                ' %s="%s"',
                htmlspecialchars($key),
                htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8')
            );
        }

        return $html;
    }

    /**
     * Ensures that an HTML element has an `id` attribute when a `name` is present.
     *
     * - If an `id` already exists, nothing is changed
     * - If no `id` exists but a `name` does, the `id` is auto-generated from the name
     * - For radio inputs, the value is appended to ensure unique IDs per option
     * - The generated ID is normalized to contain only letters, numbers, and underscores
     *
     * This method improves accessibility by guaranteeing that inputs
     * can be safely associated with `<label for="...">` elements.
     *
     * Example (text input):
     * ```php
     * Form::text([
     *     'name' => 'email',
     * ]);
     * ```
     *
     * Resulting HTML:
     * ```html
     * <input type="text" name="email" id="email">
     * ```
     *
     * Example (radio input):
     * ```php
     * Form::radio([
     *     'name'  => 'gender',
     *     'value' => 'male',
     * ]);
     * ```
     *
     * Resulting HTML:
     * ```html
     * <input type="radio" name="gender" value="male" id="gender_male">
     * ```
     *
     * @param array<string, mixed> &$attributes
     * @return void
     */
    protected static function ensureId(array &$attributes): void
    {
        if (isset($attributes['id']) || !isset($attributes['name'])) {
            return;
        }

        $id = $attributes['name'];

        if (($attributes['type'] ?? null) === 'radio' && isset($attributes['value'])) {
            $id .= '_' . $attributes['value'];
        }

        $attributes['id'] = preg_replace('/[^a-z0-9_]+/i', '_', $id);
    }

    /**
     * Automatically applies a validation error CSS class to an element
     * if a validation error exists for its `name` attribute.
     *
     * - Checks the session error bag (`$_SESSION['errors']`)
     * - Appends the `is-invalid` class when an error is present
     * - Preserves any existing CSS classes
     *
     * This method centralizes validation styling logic so individual
     * form elements don’t need to handle it themselves.
     *
     * Example:
     * ```php
     * // Given:
     * $_SESSION['errors']['email'] = 'Invalid email address';
     *
     * echo Form::email([
     *     'name'  => 'email',
     *     'class' => 'form-control',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input type="email" name="email" class="form-control is-invalid" id="email">
     * ```
     *
     * @param array<string, mixed> &$attributes
     * @return void
     */
    protected static function applyErrorClass(array &$attributes): void
    {
        if (isset($attributes['name']) && self::hasError($attributes['name'])) {
            $attributes['class'] = trim(($attributes['class'] ?? '') . ' is-invalid');
        }
    }

    /**
     * Retrieves the previously submitted value for a form field.
     *
     * - Reads values from the session `$_SESSION['old']`
     * - Returns the stored value if it exists
     * - Falls back to the provided default value when no old value is found
     *
     * This enables "sticky" form inputs after validation errors,
     * mimicking Laravel’s `old()` helper behavior.
     *
     * Example:
     * ```php
     * // After a failed form submission:
     * $_SESSION['old']['username'] = 'john_doe';
     *
     * echo Form::text([
     *     'name' => 'username',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input type="text" name="username" value="john_doe" id="username">
     * ```
     *
     * Example with default value:
     * ```php
     * echo Form::text([
     *     'name'  => 'country',
     *     'value' => 'US',
     * ]);
     * ```
     *
     * If no old value exists, the input will use `"US"`.
     *
     * @param string $name     The input field name
     * @param mixed  $default Fallback value if no old input exists
     * @return mixed
     */
    protected static function old(string $name, $default = null)
    {
        return $_SESSION['old'][$name] ?? $default;
    }

    /**
     * Determines whether a validation error exists for a given form field.
     *
     * - Checks the session error bag (`$_SESSION['errors']`)
     * - Returns `true` if an error is present for the specified field name
     * - Returns `false` otherwise
     *
     * This method is used internally to drive validation styling
     * and error message rendering.
     *
     * Example:
     * ```php
     * $_SESSION['errors'] = [
     *     'email' => 'The email field is required.',
     * ];
     *
     * if (Form::hasError('email')) {
     *     echo 'Email has an error';
     * }
     * ```
     *
     * @param string $name The form field name
     * @return bool
     */
    protected static function hasError(string $name): bool
    {
        return isset($_SESSION['errors'][$name]);
    }

    /**
     * Retrieves the first validation error message for a given form field.
     *
     * - Reads the error data from the session error bag (`$_SESSION['errors']`)
     * - Supports both single-string errors and arrays of error messages
     * - If multiple errors exist, only the first message is returned
     * - Returns `null` when no validation error is present for the field
     *
     * This method is intentionally minimal and is designed to be used
     * internally by other helpers (such as `error()`) that handle
     * presentation and HTML rendering.
     *
     * Example (single error):
     * ```php
     * $_SESSION['errors'] = [
     *     'email' => 'The email field is required.',
     * ];
     *
     * echo Form::errorMessage('email');
     * ```
     *
     * Example (multiple errors):
     * ```php
     * $_SESSION['errors'] = [
     *     'password' => [
     *         'The password field is required.',
     *         'The password must be at least 8 characters.',
     *     ],
     * ];
     *
     * echo Form::errorMessage('password');
     * ```
     *
     * Output:
     * ```text
     * The password field is required.
     * ```
     *
     * @param string $name The form field name
     * @return string|null The first validation error message or null if none exists
     */
    protected static function errorMessage(string $name): ?string
    {
        $error = $_SESSION['errors'][$name] ?? null;

        if (is_array($error)) {
            return $error[0] ?? null;
        }

        return $error;
    }

    /**
     * Renders all validation error messages for a given form field.
     *
     * - Retrieves validation errors from the session error bag (`$_SESSION['errors']`)
     * - Supports both single string errors and multiple error messages per field
     * - Returns an empty string if no errors exist for the field
     * - Wraps all messages in a container with the `invalid-feedback` class
     * - Escapes all messages to prevent XSS vulnerabilities
     *
     * This method is useful when a field may have multiple validation rules
     * and you want to display every related error instead of only the first one.
     *
     * Example (single error):
     * ```php
     * $_SESSION['errors'] = [
     *     'email' => 'The email field is required.',
     * ];
     *
     * echo Form::errors('email');
     * ```
     *
     * Output:
     * ```html
     * <div class="invalid-feedback">
     *     <div>The email field is required.</div>
     * </div>
     * ```
     *
     * Example (multiple errors):
     * ```php
     * $_SESSION['errors'] = [
     *     'password' => [
     *         'The password field is required.',
     *         'The password must be at least 8 characters.',
     *     ],
     * ];
     *
     * echo Form::errors('password');
     * ```
     *
     * Output:
     * ```html
     * <div class="invalid-feedback">
     *     <div>The password field is required.</div>
     *     <div>The password must be at least 8 characters.</div>
     * </div>
     * ```
     *
     * @param string $name The form field name
     * @return string Rendered HTML containing validation errors or an empty string
     */
    public static function errors(string $name): string
    {
        $errors = $_SESSION['errors'][$name] ?? [];

        if (empty($errors)) {
            return '';
        }

        $errors = (array) $errors;

        $html = '<div class="invalid-feedback">';

        foreach ($errors as $message) {
            $html .= '<div>' . htmlspecialchars($message) . '</div>';
        }

        return $html . '</div>';
    }


    /* -------------------------------------------------
     | Inputs
     * ------------------------------------------------- */
    /**
     * Renders a generic HTML `<input>` element.
     *
     * - Automatically generates an `id` from the `name` attribute when missing
     * - Applies validation error styling when errors exist
     * - Automatically fills the `value` attribute using old input data
     * - Safely escapes all attributes
     *
     * This is the base method used by all specific input helpers
     * such as `text()`, `email()`, and `password()`.
     *
     * Example:
     * ```php
     * echo Form::input([
     *     'type'  => 'text',
     *     'name'  => 'username',
     *     'class' => 'form-control',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input type="text" name="username" id="username" class="form-control">
     * ```
     *
     * Example with old input:
     * ```php
     * $_SESSION['old']['username'] = 'john_doe';
     *
     * echo Form::text([
     *     'name' => 'username',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input type="text" name="username" value="john_doe" id="username">
     * ```
     *
     * @param array<string, mixed> $attributes HTML attributes for the input element
     * @return string Rendered HTML input element
     */
    public static function input(array $attributes): string
    {
        self::ensureId($attributes);
        self::applyErrorClass($attributes);

        if (isset($attributes['name']) && !isset($attributes['value'])) {
            $attributes['value'] = self::old($attributes['name']);
        }

        return '<input' . self::attributes($attributes) . '>';
    }

    /**
     * Renders a text `<input>` element.
     *
     * - Sets the input type to `text`
     * - Delegates all rendering logic to the base `input()` method
     * - Supports automatic ID generation, old input values, and validation styling
     *
     * This is the most commonly used input helper and should be used
     * for standard single-line text fields.
     *
     * Example:
     * ```php
     * echo Form::text([
     *     'name'        => 'first_name',
     *     'class'       => 'form-control',
     *     'placeholder' => 'First name',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input
     *     type="text"
     *     name="first_name"
     *     id="first_name"
     *     class="form-control"
     *     placeholder="First name"
     * >
     * ```
     *
     * Example with validation error:
     * ```php
     * $_SESSION['errors']['first_name'] = 'First name is required.';
     *
     * echo Form::text([
     *     'name'  => 'first_name',
     *     'class' => 'form-control',
     * ]);
     * ```
     *
     * The input will automatically receive the `is-invalid` class.
     *
     * @param array<string, mixed> $attributes HTML attributes for the text input
     * @return string Rendered HTML text input
     */
    public static function text(array $attributes): string
    {
        return self::input(array_merge(['type' => 'text'], $attributes));
    }

    /**
     * Renders an email `<input>` element.
     *
     * - Sets the input type to `email`
     * - Delegates rendering to the base `input()` method
     * - Supports automatic ID generation, old input values, and validation styling
     * - Enables native browser email validation
     *
     * This helper should be used for email address fields.
     *
     * Example:
     * ```php
     * echo Form::email([
     *     'name'        => 'email',
     *     'class'       => 'form-control',
     *     'placeholder' => 'you@example.com',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input
     *     type="email"
     *     name="email"
     *     id="email"
     *     class="form-control"
     *     placeholder="you@example.com"
     * >
     * ```
     *
     * Example with old input and validation error:
     * ```php
     * $_SESSION['old']['email'] = 'invalid@';
     * $_SESSION['errors']['email'] = 'Please enter a valid email address.';
     *
     * echo Form::email([
     *     'name'  => 'email',
     *     'class' => 'form-control',
     * ]);
     * ```
     *
     * The input will:
     * - Be pre-filled with `invalid@`
     * - Automatically receive the `is-invalid` class
     *
     * @param array<string, mixed> $attributes HTML attributes for the email input
     * @return string Rendered HTML email input
     */
    public static function email(array $attributes): string
    {
        return self::input(array_merge(['type' => 'email'], $attributes));
    }

    /**
     * Renders a password `<input>` element.
     *
     * - Sets the input type to `password`
     * - Delegates rendering to the base `input()` method
     * - Applies validation styling when errors exist
     * - Does NOT automatically repopulate the value from old input
     *
     * This helper should be used for password fields where
     * security best practices require not re-filling the value
     * after a failed submission.
     *
     * Example:
     * ```php
     * echo Form::password([
     *     'name'  => 'password',
     *     'class' => 'form-control',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input
     *     type="password"
     *     name="password"
     *     id="password"
     *     class="form-control"
     * >
     * ```
     *
     * Example with validation error:
     * ```php
     * $_SESSION['errors']['password'] = 'Password must be at least 8 characters.';
     *
     * echo Form::password([
     *     'name'  => 'password',
     *     'class' => 'form-control',
     * ]);
     * ```
     *
     * The input will receive the `is-invalid` class,
     * but the value will remain empty.
     *
     * @param array<string, mixed> $attributes HTML attributes for the password input
     * @return string Rendered HTML password input
     */
    public static function password(array $attributes): string
    {
        return self::input(array_merge(['type' => 'password'], $attributes));
    }

    /**
     * Renders a URL `<input>` element.
     *
     * - Sets the input type to `url`
     * - Delegates all rendering logic to the base `input()` method
     * - Supports automatic ID generation, old input values, and validation styling
     * - Enables native browser URL validation
     *
     * This helper should be used for fields that expect
     * a full URL (e.g. website, profile link).
     *
     * Example:
     * ```php
     * echo Form::url([
     *     'name'        => 'website',
     *     'class'       => 'form-control',
     *     'placeholder' => 'https://example.com',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input
     *     type="url"
     *     name="website"
     *     id="website"
     *     class="form-control"
     *     placeholder="https://example.com"
     * >
     * ```
     *
     * Example with old input:
     * ```php
     * $_SESSION['old']['website'] = 'https://my-site.dev';
     *
     * echo Form::url([
     *     'name' => 'website',
     * ]);
     * ```
     *
     * @param array<string, mixed> $attributes HTML attributes for the URL input
     * @return string Rendered HTML URL input
     */
    public static function url(array $attributes): string
    {
        return self::input(array_merge(['type' => 'url'], $attributes));
    }

    /**
     * Renders a telephone number `<input>` element.
     *
     * - Sets the input type to `tel`
     * - Delegates rendering to the base `input()` method
     * - Supports automatic ID generation, old input values, and validation styling
     * - Allows browser and mobile devices to show a phone-optimized keyboard
     *
     * This helper should be used for phone number fields,
     * regardless of formatting rules (those are handled server-side).
     *
     * Example:
     * ```php
     * echo Form::tel([
     *     'name'        => 'phone',
     *     'class'       => 'form-control',
     *     'placeholder' => '+1 555 123 4567',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input
     *     type="tel"
     *     name="phone"
     *     id="phone"
     *     class="form-control"
     *     placeholder="+1 555 123 4567"
     * >
     * ```
     *
     * Example with validation error:
     * ```php
     * $_SESSION['errors']['phone'] = 'Invalid phone number.';
     *
     * echo Form::tel([
     *     'name'  => 'phone',
     *     'class' => 'form-control',
     * ]);
     * ```
     *
     * The input will automatically receive the `is-invalid` class.
     *
     * @param array<string, mixed> $attributes HTML attributes for the telephone input
     * @return string Rendered HTML telephone input
     */
    public static function tel(array $attributes): string
    {
        return self::input(array_merge(['type' => 'tel'], $attributes));
    }

    /**
     * Renders a numeric `<input>` element.
     *
     * - Sets the input type to `number`
     * - Accepts all standard HTML input attributes
     * - Supports numeric constraints such as `min`, `max`, and `step`
     * - Automatically supports validation error styling
     *
     * Example:
     * ```php
     * echo Form::number([
     *     'name' => 'age',
     *     'min'  => 0,
     *     'max'  => 120,
     *     'step' => 1,
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input type="number" name="age" min="0" max="120" step="1">
     * ```
     *
     * Example (price input):
     * ```php
     * echo Form::number([
     *     'name'  => 'price',
     *     'step'  => '0.01',
     * ]);
     * ```
     *
     * @param array<string, mixed> $attributes HTML attributes for the number input
     * @return string Rendered HTML number input
     */
    public static function number(array $attributes): string
    {
        return self::input(array_merge([
            'type' => 'number',
        ], $attributes));
    }

    /* -------------------------------------------------
    | File Input
    * ------------------------------------------------- */

    /**
     * Renders a file input (<input type="file">).
     *
     * - Supports single or multiple file uploads via 'multiple' attribute.
     * - Automatically generates an id and applies validation error styling.
     * - Note: Ensure the form has enctype="multipart/form-data" to handle uploads.
     *
     * Example:
     * Form::file([
     *     'name'     => 'avatar',
     *     'class'    => 'form-control',
     *     'multiple' => false,
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function file(array $attributes): string
    {
        return self::input(array_merge(['type' => 'file'], $attributes));
    }


    /* -------------------------------------------------
    | Additional HTML5 Inputs
    * ------------------------------------------------- */

    /**
     * Renders a color picker input (<input type="color">).
     *
     * - Allows users to select a color.
     * - Supports old input and validation styling.
     *
     * Example:
     * Form::color([
     *     'name'  => 'favorite_color',
     *     'class' => 'form-control',
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function color(array $attributes): string
    {
        return self::input(array_merge(['type' => 'color'], $attributes));
    }

    /**
     * Renders a range slider input (<input type="range">).
     *
     * - Supports min, max, and step attributes.
     * - Supports old input and validation styling.
     *
     * Example:
     * Form::range([
     *     'name' => 'volume',
     *     'min'  => 0,
     *     'max'  => 100,
     *     'step' => 1,
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function range(array $attributes): string
    {
        return self::input(array_merge(['type' => 'range'], $attributes));
    }

    /**
     * Renders a date input (<input type="date">).
     *
     * - Supports old input and validation styling.
     * - Provides native browser date picker.
     *
     * Example:
     * Form::date([
     *     'name' => 'birthday',
     *     'class' => 'form-control',
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function date(array $attributes): string
    {
        return self::input(array_merge(['type' => 'date'], $attributes));
    }

    /**
     * Renders a datetime-local input (<input type="datetime-local">).
     *
     * - Supports old input and validation styling.
     * - Provides native browser datetime picker (local timezone).
     *
     * Example:
     * Form::datetimeLocal([
     *     'name' => 'appointment',
     *     'class' => 'form-control',
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function datetimeLocal(array $attributes): string
    {
        return self::input(array_merge(['type' => 'datetime-local'], $attributes));
    }

    /* -------------------------------------------------
     | Textarea & Select
     * ------------------------------------------------- */
    /**
     * Renders a `<textarea>` element.
     *
     * - Automatically generates an `id` from the `name` attribute when missing
     * - Applies validation error styling when errors exist
     * - Populates its content using old input data or a provided default value
     * - Escapes the textarea content to prevent XSS
     *
     * Unlike `<input>` elements, textarea values are rendered
     * between opening and closing tags instead of a `value` attribute.
     *
     * Example:
     * ```php
     * echo Form::textarea([
     *     'name'  => 'bio',
     *     'class' => 'form-control',
     *     'rows'  => 5,
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <textarea
     *     name="bio"
     *     id="bio"
     *     class="form-control"
     *     rows="5"
     * ></textarea>
     * ```
     *
     * Example with old input:
     * ```php
     * $_SESSION['old']['bio'] = 'Short biography text...';
     *
     * echo Form::textarea([
     *     'name' => 'bio',
     * ]);
     * ```
     *
     * The textarea will be pre-filled with the old value.
     *
     * @param array<string, mixed> $attributes HTML attributes for the textarea
     * @return string Rendered HTML textarea element
     */
    public static function textarea(array $attributes): string
    {
        self::ensureId($attributes);
        self::applyErrorClass($attributes);

        $name  = $attributes['name'] ?? null;
        $value = self::old($name ?? '', $attributes['value'] ?? '');

        unset($attributes['value']);

        return sprintf(
            '<textarea%s>%s</textarea>',
            self::attributes($attributes),
            htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8')
        );
    }

    /**
     * Renders a `<select>` (dropdown) element.
     *
     * - Automatically generates an `id` from the `name` attribute when missing
     * - Applies validation error styling when errors exist
     * - Supports single and multiple selection
     * - Automatically fills selected options using old input data
     * - Accepts an `options` array to define available choices
     *
     * The `options` array should be provided as:
     * `value => label`
     *
     * Example:
     * ```php
     * echo Form::select([
     *     'name'    => 'country',
     *     'class'   => 'form-control',
     *     'options' => [
     *         'US' => 'United States',
     *         'CA' => 'Canada',
     *     ],
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <select name="country" id="country" class="form-control">
     *     <option value="US">United States</option>
     *     <option value="CA">Canada</option>
     * </select>
     * ```
     *
     * Example with selected value:
     * ```php
     * echo Form::select([
     *     'name'    => 'country',
     *     'value'   => 'CA',
     *     'options' => [
     *         'US' => 'United States',
     *         'CA' => 'Canada',
     *     ],
     * ]);
     * ```
     *
     * Example with multiple selection:
     * ```php
     * echo Form::select([
     *     'name'     => 'roles',
     *     'multiple' => true,
     *     'options'  => [
     *         'admin'  => 'Admin',
     *         'editor' => 'Editor',
     *     ],
     * ]);
     * ```
     *
     * @param array<string, mixed> $attributes Configuration and HTML attributes
     * @return string Rendered HTML select element
     */
    public static function select(array $attributes): string
    {
        self::ensureId($attributes);
        self::applyErrorClass($attributes);

        $options  = $attributes['options'] ?? [];
        $multiple = $attributes['multiple'] ?? false;
        $name     = $attributes['name'] ?? '';

        $value = self::old($name, $attributes['value'] ?? null);

        unset($attributes['options'], $attributes['value']);

        // if ($multiple && !str_ends_with($name, '[]')) { // PHP 8+
        if ($multiple && substr($name, -2) !== '[]') {    
            $attributes['name'] .= '[]';
        }

        $htmlOptions = '';

        foreach ($options as $key => $label) {
            $selected = $multiple
                ? in_array((string) $key, array_map('strval', (array) $value), true)
                : ((string) $key === (string) $value);

            $htmlOptions .= sprintf(
                '<option value="%s"%s>%s</option>',
                htmlspecialchars((string) $key),
                $selected ? ' selected' : '',
                htmlspecialchars((string) $label)
            );
        }

        return '<select' . self::attributes($attributes) . '>' . $htmlOptions . '</select>';
    }

    /* -------------------------------------------------
     | Buttons & Labels
     * ------------------------------------------------- */
    /**
     * Renders a `<button>` element.
     *
     * - Supports all standard HTML button attributes
     * - Defaults the button type to `button` if none is provided
     * - Accepts a `text` attribute to define the button label
     * - Escapes the button text to prevent XSS
     *
     * This helper can be used for regular buttons, submit buttons,
     * or reset buttons depending on the provided type.
     *
     * Example:
     * ```php
     * echo Form::button([
     *     'type'  => 'submit',
     *     'class' => 'btn btn-primary',
     *     'text'  => 'Save',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <button type="submit" class="btn btn-primary">Save</button>
     * ```
     *
     * Example (default type):
     * ```php
     * echo Form::button([
     *     'class' => 'btn btn-secondary',
     *     'text'  => 'Cancel',
     * ]);
     * ```
     *
     * The button type will default to `button`.
     *
     * @param array<string, mixed> $attributes HTML attributes and button text
     * @return string Rendered HTML button element
     */
    /**
     * Renders a generic HTML <button> element.
     *
     * Default behavior:
     * - Uses <button>
     * - Default type is "button"
     * - Uses the "text" attribute as the button label
     *
     * Example:
     * Form::button([
     *     'text'  => 'Click me',
     *     'class' => 'btn btn-secondary',
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function button(array $attributes): string
    {
        $text = $attributes['text'] ?? '';
        unset($attributes['text']);

        if (!isset($attributes['type'])) {
            $attributes['type'] = 'button';
        }

        return '<button' . self::attributes($attributes) . '>'
            . htmlspecialchars($text, ENT_QUOTES, 'UTF-8')
            . '</button>';
    }

    /**
     * Renders a submit button (<button type="submit">).
     *
     * This is a semantic wrapper around Form::button().
     * Use it inside forms to submit data.
     *
     * Example:
     * Form::submit([
     *     'text'  => 'Save',
     *     'class' => 'btn btn-primary',
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function submit(array $attributes): string
    {
        $attributes['type'] = 'submit';

        return self::button($attributes);
    }


    /**
     * Renders a reset button (<button type="reset">).
     *
     * Resets all form fields to their initial values.
     *
     * Example:
     * Form::reset([
     *     'text'  => 'Reset',
     *     'class' => 'btn btn-warning',
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function reset(array $attributes): string
    {
        $attributes['type'] = 'reset';

        return self::button($attributes);
    }

    /**
     * Renders an <input type="submit"> element.
     *
     * Use this only if you explicitly need an input-based submit button.
     * Otherwise, prefer Form::submit().
     *
     * Example:
     * Form::submitInput([
     *     'value' => 'Send',
     *     'class' => 'btn btn-primary',
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function submitInput(array $attributes): string
    {
        $attributes['type'] = 'submit';

        return '<input' . self::attributes($attributes) . '>';
    }

    /**
     * Renders an HTML `<label>` element.
     *
     * - Associates the label with a form control via the `for` attribute
     * - Escapes the label text to prevent XSS
     * - Supports additional HTML attributes such as `class`
     *
     * Proper use of labels improves accessibility and usability,
     * especially for screen readers and form focus behavior.
     *
     * Example:
     * ```php
     * echo Form::label('email', 'Email Address', [
     *     'class' => 'form-label',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <label for="email" class="form-label">Email Address</label>
     * ```
     *
     * Example with auto-generated input ID:
     * ```php
     * echo Form::email(['name' => 'email']);
     * echo Form::label('email', 'Email');
     * ```
     *
     * @param string $for  The ID of the form control this label refers to
     * @param string $text The label text
     * @param array<string, mixed> $attributes Additional label attributes
     * @return string Rendered HTML label element
     */
    public static function label(string $for, string $text, array $attributes = []): string
    {
        $attributes['for'] ??= $for;

        return sprintf(
            '<label%s>%s</label>',
            self::attributes($attributes),
            htmlspecialchars($text, ENT_QUOTES, 'UTF-8')
        );
    }

    /* -------------------------------------------------
     | Checkbox & Radio
     * ------------------------------------------------- */
     /**
     * Renders a checkbox `<input>` element.
     *
     * - Sets the input type to `checkbox`
     * - Automatically generates an `id` from the `name` attribute when missing
     * - Applies validation error styling when errors exist
     * - Supports an optional hidden input for unchecked values (Laravel-style)
     * - Automatically determines the checked state using old input data
     *
     * The `unchecked` attribute, when provided, generates a hidden input
     * to ensure a value is always submitted even when the checkbox is unchecked.
     *
     * Example:
     * ```php
     * echo Form::checkBox([
     *     'name'      => 'terms',
     *     'value'     => '1',
     *     'unchecked' => '0',
     *     'class'     => 'form-check-input',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input type="hidden" name="terms" value="0">
     * <input type="checkbox" name="terms" value="1" id="terms" class="form-check-input">
     * ```
     *
     * Example with old input:
     * ```php
     * $_SESSION['old']['terms'] = '1';
     *
     * echo Form::checkBox([
     *     'name'  => 'terms',
     *     'value' => '1',
     * ]);
     * ```
     *
     * The checkbox will be rendered as checked.
     *
     * @param array<string, mixed> $attributes HTML attributes and configuration
     * @return string Rendered HTML checkbox input(s)
     */
    public static function checkBox(array $attributes): string
    {
        $attributes['type'] ??= 'checkbox';
        $attributes['value'] ??= '1';

        $unchecked = $attributes['unchecked'] ?? null;
        unset($attributes['unchecked']);

        self::ensureId($attributes);
        self::applyErrorClass($attributes);

        $name = $attributes['name'] ?? null;

        if ($name !== null) {
            $old = self::old($name);
            if ((string) $old === (string) $attributes['value']) {
                $attributes['checked'] = true;
            }
        }

        //$attributes['checked'] = !empty($attributes['checked']) ? true : null;
        if (empty($attributes['checked'])) {
           unset($attributes['checked']);
        }

        $html = '';

        if ($unchecked !== null && $name !== null) {
            $html .= sprintf(
                '<input type="hidden" name="%s" value="%s">',
                htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
                htmlspecialchars((string) $unchecked, ENT_QUOTES, 'UTF-8')
            );
        }

        $html .= '<input' . self::attributes($attributes) . '>';

        return $html;
    }

    /**
     * Renders a radio button `<input>` element.
     *
     * - Sets the input type to `radio`
     * - Requires both `name` and `value` attributes
     * - Automatically generates a unique `id` using name and value
     * - Applies validation error styling when errors exist
     * - Automatically determines the checked state using old input data
     *
     * Radio buttons sharing the same name form a logical group,
     * where only one option may be selected.
     *
     * Example:
     * ```php
     * echo Form::radio([
     *     'name'  => 'gender',
     *     'value' => 'male',
     *     'class' => 'form-check-input',
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input
     *     type="radio"
     *     name="gender"
     *     value="male"
     *     id="gender_male"
     *     class="form-check-input"
     * >
     * ```
     *
     * Example with old input:
     * ```php
     * $_SESSION['old']['gender'] = 'female';
     *
     * echo Form::radio([
     *     'name'  => 'gender',
     *     'value' => 'female',
     * ]);
     * ```
     *
     * The radio button will be rendered as checked.
     *
     * @param array<string, mixed> $attributes HTML attributes for the radio input
     * @return string Rendered HTML radio input
     *
     * @throws InvalidArgumentException If name or value is missing
     */
    public static function radio(array $attributes): string
    {
        $attributes['type'] ??= 'radio';

        if (!isset($attributes['name'], $attributes['value'])) {
            throw new InvalidArgumentException('Radio input requires name and value.');
        }

        self::ensureId($attributes);
        self::applyErrorClass($attributes);

        $old = self::old($attributes['name']);

        if ((string) $old === (string) $attributes['value']) {
            $attributes['checked'] = true;
        }

        $attributes['checked'] = !empty($attributes['checked']) ? true : null;

        return '<input' . self::attributes($attributes) . '>';
    }

    /* -------------------------------------------------
     | Groups
     * ------------------------------------------------- */
    /**
     * Renders a group of checkbox inputs from a configuration array.
     *
     * - Automatically renders multiple checkbox inputs sharing the same base name
     * - Supports stacked or inline layouts
     * - Automatically determines checked values using old input data
     * - Displays a single validation error message for the entire group
     *
     * Each checkbox will be named using array syntax (`name[]`)
     * so multiple values can be submitted.
     *
     * Required configuration keys:
     * - `name`    : Base name of the checkbox group
     * - `options` : Array of value => label pairs
     *
     * Optional configuration keys:
     * - `value`        : Default selected values (array)
     * - `inline`       : Render checkboxes inline (boolean)
     * - `class`        : CSS class for the checkbox inputs
     * - `label_class`  : CSS class for labels
     * - `item_class`   : Wrapper class for each checkbox item
     *
     * Example:
     * ```php
     * echo Form::checkBoxGroup([
     *     'name'    => 'skills',
     *     'options' => [
     *         'php'    => 'PHP',
     *         'js'     => 'JavaScript',
     *         'python' => 'Python',
     *     ],
     *     'inline' => true,
     * ]);
     * ```
     *
     * Example with old input:
     * ```php
     * $_SESSION['old']['skills'] = ['php', 'python'];
     * ```
     *
     * @param array<string, mixed> $config Configuration options for the checkbox group
     * @return string Rendered HTML checkbox group
     *
     * @throws InvalidArgumentException If required configuration keys are missing
     */
    public static function checkBoxGroup(array $config): string
    {
        if (!isset($config['name'], $config['options'])) {
            throw new InvalidArgumentException('checkBoxGroup requires name and options.');
        }

        $name    = $config['name'];
        $options = $config['options'];
        $values  = array_map('strval', (array) self::old($name, $config['value'] ?? []));
        $inline  = $config['inline'] ?? false;

        $itemCls = ($config['item_class'] ?? 'form-check') . ($inline ? ' form-check-inline' : '');
        $html    = '';

        foreach ($options as $value => $label) {
            $id = $name . '_' . $value;

            $html .= '<div class="' . htmlspecialchars($itemCls) . '">';
            $html .= self::checkBox([
                'name'    => $name . '[]',
                'value'   => $value,
                'id'      => $id,
                'checked' => in_array((string) $value, $values, true),
                'class'   => $config['class'] ?? '',
            ]);
            $html .= self::label($id, $label, ['class' => $config['label_class'] ?? '']);
            $html .= '</div>';
        }

        return $html . self::errors($name);
    }

    /**
     * Renders a group of radio button inputs from a configuration array.
     *
     * - Automatically renders multiple radio inputs sharing the same name
     * - Supports stacked or inline layouts
     * - Automatically determines the selected option using old input data
     * - Displays a single validation error message for the entire group
     *
     * Only one radio option can be selected at a time.
     *
     * Required configuration keys:
     * - `name`    : Name of the radio group
     * - `options` : Array of value => label pairs
     *
     * Optional configuration keys:
     * - `value`        : Default selected value
     * - `inline`       : Render radio buttons inline (boolean)
     * - `class`        : CSS class for radio inputs
     * - `label_class`  : CSS class for labels
     * - `item_class`   : Wrapper class for each radio item
     *
     * Example:
     * ```php
     * echo Form::radioGroup([
     *     'name'    => 'status',
     *     'options' => [
     *         'active'   => 'Active',
     *         'inactive' => 'Inactive',
     *     ],
     * ]);
     * ```
     *
     * Example with old input:
     * ```php
     * $_SESSION['old']['status'] = 'inactive';
     * ```
     *
     * @param array<string, mixed> $config Configuration options for the radio group
     * @return string Rendered HTML radio group
     *
     * @throws InvalidArgumentException If required configuration keys are missing
     */
    public static function radioGroup(array $config): string
    {
        if (!isset($config['name'], $config['options'])) {
            throw new InvalidArgumentException('radioGroup requires name and options.');
        }

        $name    = $config['name'];
        $options = $config['options'];
        $value   = (string) self::old($name, $config['value'] ?? '');
        $inline  = $config['inline'] ?? false;

        $itemCls = ($config['item_class'] ?? 'form-check') . ($inline ? ' form-check-inline' : '');
        $html    = '';

        foreach ($options as $val => $label) {
            $id = $name . '_' . $val;

            $html .= '<div class="' . htmlspecialchars($itemCls) . '">';
            $html .= self::radio([
                'name'    => $name,
                'value'   => $val,
                'id'      => $id,
                'checked' => ((string) $val === $value),
                'class'   => $config['class'] ?? '',
            ]);
            $html .= self::label($id, $label, ['class' => $config['label_class'] ?? '']);
            $html .= '</div>';
        }

        return $html . self::errors($name);
    }

    /**
     * Opens an HTML <form> tag.
     *
     * Features:
     * - Supports all standard form attributes
     * - Supports method spoofing (PUT, PATCH, DELETE)
     * - Optional CSRF token injection
     * - Automatically sets enctype="multipart/form-data" for file uploads
     *
     * Example:
     * Form::open([
     *     'action' => '/users',
     *     'method' => 'POST',
     *     'csrf'   => true,
     *     'files'  => true, // <-- automatically adds enctype
     * ]);
     *
     * @param array<string, mixed> $attributes
     * @return string
     */
    public static function open(array $attributes = []): string
    {
        $method = strtoupper($attributes['method'] ?? 'POST');
        $csrf   = $attributes['csrf'] ?? false;
        $files  = $attributes['files'] ?? false; // new flag for file uploads

        unset($attributes['csrf'], $attributes['files']);

        // Real HTML form method
        $formMethod = in_array($method, ['GET', 'POST'], true) ? $method : 'POST';
        $attributes['method'] = strtolower($formMethod);

        // Automatically add enctype if file uploads are enabled
        if ($files) {
            $attributes['enctype'] = 'multipart/form-data';
        }

        $html = '<form' . self::attributes($attributes) . '>';

        // Method spoofing
        if ($method !== $formMethod) {
            $html .= self::input([
                'type'  => 'hidden',
                'name'  => '_method',
                'value' => $method,
            ]);
        }

        // CSRF token
        if ($csrf) {
            $html .= self::csrf();
        }

        return $html;
    }


    /**
     * Closes an HTML <form> tag.
     *
     * Example:
     * Form::close();
     *
     * @return string
     */
    public static function close(): string
    {
        return '</form>';
    }

    /**
     * Renders a CSRF hidden input field.
     *
     * The token should be generated and stored in session elsewhere.
     *
     * Example:
     * Form::csrf();
     *
     * @return string
     */
    public static function csrf(): string
    {
        $token = $_SESSION['_csrf'] ?? '';

        return self::input([
            'type'  => 'hidden',
            'name'  => '_token',
            'value' => $token,
        ]);
    }

    /**
     * Renders a hidden `<input>` element.
     *
     * - Sets the input type to `hidden`
     * - Accepts all standard HTML input attributes
     * - Commonly used for IDs, tokens, flags, and method spoofing
     * - Fully compatible with form submissions and validation workflows
     *
     * Example:
     * ```php
     * echo Form::hidden([
     *     'name'  => 'user_id',
     *     'value' => 42,
     * ]);
     * ```
     *
     * Output:
     * ```html
     * <input type="hidden" name="user_id" value="42">
     * ```
     *
     * Example (CSRF token):
     * ```php
     * echo Form::hidden([
     *     'name'  => '_token',
     *     'value' => $_SESSION['_token'],
     * ]);
     * ```
     *
     * @param array<string, mixed> $attributes HTML attributes for the hidden input
     * @return string Rendered HTML hidden input
     */
    public static function hidden(array $attributes): string
    {
        return self::input(array_merge([
            'type' => 'hidden',
        ], $attributes));
    }

    /**
     * Renders a toolbox button or action item.
     *
     * @param array<string, mixed> $args
     *      'icon'    => string (icon class)
     *      'onclick' => string (JS function)
     *      'color'   => string (CSS color or class)
     *      'tooltip' => string (optional)
     *      'class'   => string additional CSS classes
     *
     * @return string
     */
    public static function toolBox(array $args): string
    {
        $icon     = htmlspecialchars($args['icon'] ?? '');
        $onclick  = htmlspecialchars($args['onclick'] ?? '');
        $color    = htmlspecialchars($args['color'] ?? '');
        $tooltip  = htmlspecialchars($args['tooltip'] ?? '');
        $class    = htmlspecialchars($args['class'] ?? 'toolbox-btn');

        $style = $color ? "style=\"color: {$color};\"" : '';

        return sprintf(
            '<button type="button" class="%s" onclick="%s" title="%s" %s>
                <i class="%s"></i>
            </button>',
            $class,
            $onclick,
            $tooltip,
            $style,
            $icon
        );
    }

        
}
