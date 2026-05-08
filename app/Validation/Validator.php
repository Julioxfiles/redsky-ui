<?php

namespace App\Validation;

class Validator
{
    protected array $data = [];
    protected array $rules = [];
    protected array $errors = [];
    protected array $messages = [];

    public static function make(array $data, array $rules, array $messages = []): self
    {
        $instance = new self;
        $instance->data = $data;
        $instance->rules = $rules;
        $instance->messages = $messages;

        return $instance;
    }

    public function fails(): bool
    {
        return !$this->passes();
    }

    public function passes(): bool
    {
        $this->errors = [];

        foreach ($this->rules as $field => $rules) {
            $rules = explode('|', $rules);

            foreach ($rules as $rule) {
                $value = $this->data[$field] ?? null;

                // rule:param
                [$ruleName, $param] = array_pad(explode(':', $rule), 2, null);

                $method = "validate" . ucfirst($ruleName);

                if (method_exists($this, $method)) {
                    $this->$method($field, $value, $param);
                }
            }
        }

        return empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function first(string $field): ?string
    {
        return $this->errors[$field][0] ?? null;
    }

    public function validate(): bool
    {
        if ($this->fails()) {
            session()->flash('_errors', $this->errors);
            return false;
        }

        return true;
    }

    // =========================
    // RULES
    // =========================

    protected function validateRequired($field, $value): void
    {
        if (is_null($value) || trim($value) === '') {
            $this->addError($field, 'required', 'The :field field is required.');
        }
    }

    protected function validateEmail($field, $value): void
    {
        if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->addError($field, 'email', 'The :field must be a valid email.');
        }
    }

    protected function validateMin($field, $value, $param): void
    {
        if ($value && strlen($value) < (int)$param) {
            $this->addError($field, 'min', "The :field must be at least {$param} characters.");
        }
    }

    protected function validateMax($field, $value, $param): void
    {
        if ($value && strlen($value) > (int)$param) {
            $this->addError($field, 'max', "The :field may not be greater than {$param} characters.");
        }
    }

    protected function validateConfirmed($field, $value): void
    {
        $confirm = $this->data[$field . '_confirmation'] ?? null;

        if ($value !== $confirm) {
            $this->addError($field, 'confirmed', 'The :field confirmation does not match.');
        }
    }

    // =========================
    // INTERNAL
    // =========================

    protected function addError(string $field, string $rule, string $defaultMessage): void
    {
        $message = $this->messages["{$field}.{$rule}"]
            ?? $defaultMessage;

        $message = str_replace(':field', ucfirst($field), $message);

        $this->errors[$field][] = $message;
    }
}