<?php

namespace App\Http;

class Response
{
    protected mixed $data;
    protected int $status = 200;
    protected array $headers = [];
    protected string $contentType = 'text/html';

    public function __construct(mixed $data = null, int $status = 200)
    {
        $this->data = $data;
        $this->status = $status;
    }

    /**
     * Create a JSON response instance.
     */
    public static function json($data, int $status = 200): self
    {
        $response = new self($data, $status);
        $response->contentType = 'application/json';

        return $response;
    }

    public static function html(string $html, int $status = 200): self
    {
        $response = new self($html, $status);
        $response->contentType = 'text/html';

        return $response;
    }
    /**
     * Return a successful 200 OK response.
     */
    public static function ok(mixed $data): self
    {
        return new self($data, 200);
    }

    /**
     * Return a 201 Created response.
     */
    public static function created(mixed $data): self
    {
        return new self($data, 201);
    }

    /**
     * Add a custom HTTP header to the response.
     */
    public function header(string $key, string $value): self
    {
        $this->headers[$key] = $value;
        return $this;
    }

    /**
     * Send the HTTP response to the client.
     * Sets status code, headers, and outputs JSON.
     */
    public function send(): void
    {
        http_response_code($this->status);

        foreach ($this->headers as $key => $value) {
            header("$key: $value");
        }

        header("Content-Type: {$this->contentType}");

        if ($this->contentType === 'application/json') {
            echo json_encode([
                'success' => $this->status < 400,
                'status'  => $this->status,
                'data'    => $this->data,
            ]);
        } else {
            echo $this->data;
        }
    }
    
}