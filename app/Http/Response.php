<?php

namespace App\Http;

class Response
{
    protected mixed $data;
    protected int $status = 200;
    protected array $headers = [];
    protected string $contentType = 'text/html';
    protected bool $wrap = true;

    public function __construct(mixed $data = null, int $status = 200)
    {
        $this->data = $data;
        $this->status = $status;
    }

    // =================================================
    // FACTORIES
    // =================================================

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

    public static function ok(mixed $data): self
    {
        return new self($data, 200);
    }

    public static function created(mixed $data): self
    {
        return new self($data, 201);
    }

    // =================================================
    // REDIRECT (MUY IMPORTANTE)
    // =================================================

    public static function redirect(string $to, int $status = 302): self
    {
        $response = new self(null, $status);

        return $response->header('Location', $to);
    }

    // =================================================
    // HEADERS
    // =================================================

    public function header(string $key, string $value): self
    {
        $this->headers[$key] = $value;

        return $this;
    }

    // =================================================
    // CONFIG
    // =================================================

    public function withoutWrapping(): self
    {
        $this->wrap = false;

        return $this;
    }

    // =================================================
    // SEND (CORE DEL FRAMEWORK)
    // =================================================

    public function send(): void
    {
        http_response_code($this->status);

        foreach ($this->headers as $key => $value) {
            header("{$key}: {$value}");
        }

        header("Content-Type: {$this->contentType}");

        $this->output();
    }

    // =================================================
    // OUTPUT ENGINE
    // =================================================

    protected function output(): void
    {
        if ($this->contentType === 'application/json') {
            $this->sendJson();
            return;
        }

        if ($this->contentType === 'text/html') {
            $this->sendHtml();
            return;
        }

        $this->sendRaw();
    }

    protected function sendJson(): void
    {
        if ($this->wrap) {
            echo json_encode([
                'success' => $this->status < 400,
                'status'  => $this->status,
                'data'    => $this->data,
            ]);
        } else {
            echo json_encode($this->data);
        }
    }

    protected function sendHtml(): void
    {
        echo (string) $this->data;
    }

    protected function sendRaw(): void
    {
        echo (string) $this->data;
    }
}