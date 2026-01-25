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
        $this->get    = $get;
        $this->post   = $post;
        $this->files  = $files;
        $this->server = $server;
    }

    /**
     * Create Request from PHP globals
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

    /**
     * Get all input data (GET + POST)
     */
    public function all(): array
    {
        return array_merge($this->get, $this->post);
    }

    /**
     * Get input value by key
     */
    public function input(string $key, mixed $default = null): mixed
    {
        return $this->post[$key]
            ?? $this->get[$key]
            ?? $default;
    }

    /**
     * Check if input exists
     */
    public function has(string $key): bool
    {
        return isset($this->post[$key]) || isset($this->get[$key]);
    }

    /**
     * Get only specific input keys
     */
    public function only(array $keys): array
    {
        return array_intersect_key(
            $this->all(),
            array_flip($keys)
        );
    }

    /**
     * Exclude specific input keys
     */
    public function except(array $keys): array
    {
        return array_diff_key(
            $this->all(),
            array_flip($keys)
        );
    }

    /**
     * Get uploaded file
     */
    public function file(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    /**
     * Request method (GET, POST, PUT...)
     */
    public function method(): string
    {
        return strtoupper($this->server['REQUEST_METHOD'] ?? 'GET');
    }

    /**
     * Check request method
     */
    public function isMethod(string $method): bool
    {
        return $this->method() === strtoupper($method);
    }

    /**
     * Get request URI
     */
    public function uri(): string
    {
        return strtok($this->server['REQUEST_URI'] ?? '/', '?');
    }

    /**
     * Check if request is POST
     */
    public function isPost(): bool
    {
        return $this->isMethod('POST');
    }

    /**
     * Check if request is GET
     */
    public function isGet(): bool
    {
        return $this->isMethod('GET');
    }
}
