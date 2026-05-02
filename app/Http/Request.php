<?php
declare(strict_types=1);

namespace App\Http;

class Request
{
    protected array $get;
    protected array $post;
    protected array $files;
    protected array $server;

    public function __construct(
        array $get = [],
        array $post = [],
        array $files = [],
        array $server = []
    ) {
        $this->get = $get;
        $this->post = $post;
        $this->files = $files;
        $this->server = $server;
    }

    /**
     * Capture request from globals
     */
    public static function capture(): self
    {
        return new self(
            $_GET,
            $_POST,
            $_FILES,
            $_SERVER
        );
    }

    // =================================================
    // INPUT HANDLING
    // =================================================

    public function all(): array
    {
        return array_merge($this->get, $this->post);
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->post[$key]
            ?? $this->get[$key]
            ?? $default;
    }

    public function has(string $key): bool
    {
        return array_key_exists($key, $this->all());
    }

    public function only(array $keys): array
    {
        return array_intersect_key(
            $this->all(),
            array_flip($keys)
        );
    }

    public function except(array $keys): array
    {
        return array_diff_key(
            $this->all(),
            array_flip($keys)
        );
    }

    // =================================================
    // FILES
    // =================================================

    public function file(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    public function hasFile(string $key): bool
    {
        return isset($this->files[$key]);
    }

    // =================================================
    // METHOD & URI
    // =================================================

    public function method(): string
    {
        return strtoupper($this->server['REQUEST_METHOD'] ?? 'GET');
    }

    public function isMethod(string $method): bool
    {
        return $this->method() === strtoupper($method);
    }

    public function isGet(): bool
    {
        return $this->isMethod('GET');
    }

    public function isPost(): bool
    {
        return $this->isMethod('POST');
    }

    /**
     * Full URI (clean path only)
     */
    public function uri(): string
    {
        $uri = $this->server['REQUEST_URI'] ?? '/';

        return parse_url($uri, PHP_URL_PATH) ?: '/';
    }

    /**
     * Query string as array
     */
    public function query(): array
    {
        return $this->get;
    }

    // =================================================
    // HEADERS (future-ready)
    // =================================================

    public function header(string $key, mixed $default = null): mixed
    {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $key));

        return $this->server[$key] ?? $default;
    }

    // =================================================
    // REQUEST TYPE HELPERS (Laravel-style)
    // =================================================

    public function ajax(): bool
    {
        return $this->header('X-Requested-With') === 'XMLHttpRequest';
    }

    public function wantsJson(): bool
    {
        $accept = $this->header('Accept', '');

        return str_contains($accept, 'application/json');
    }

    // =================================================
    // DEBUG HELPERS
    // =================================================

    public function ip(): ?string
    {
        return $this->server['REMOTE_ADDR'] ?? null;
    }
}