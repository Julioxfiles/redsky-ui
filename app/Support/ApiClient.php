<?php

namespace App\Support;

class ApiClient
{
    protected string $baseUrl;
    protected array $headers = [];
    protected int $timeout = 10;

    /**
     * Create instance
     */
    public function __construct(string $baseUrl, array $headers = [], int $timeout = 10)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->headers = $headers;
        $this->timeout = $timeout;
    }

    /**
     * Resolve client by service name
     */
    public static function service(string $name): self
    {
        $config = config("services.$name");

        if (!$config) {
            throw new \Exception("Service [$name] not configured.");
        }

        return new self(
            $config['base_url'],
            $config['headers'] ?? [],
            $config['timeout'] ?? 10
        );
    }

    /**
     * Add Bearer token
     */
    public function withToken(?string $token): self
    {
        if ($token) {
            $this->headers[] = "Authorization: Bearer {$token}";
        }

        return $this;
    }

    /**
     * Merge custom headers
     */
    public function withHeaders(array $headers): self
    {
        $this->headers = array_merge($this->headers, $this->normalizeHeaders($headers));
        return $this;
    }

    /**
     * GET request
     */
    public function get(string $endpoint, array $query = []): array
    {
        $url = $this->buildUrl($endpoint, $query);

        return $this->request('GET', $url);
    }

    /**
     * POST request
     */
    public function post(string $endpoint, array $data = []): array
    {
        return $this->request('POST', $this->buildUrl($endpoint), $data);
    }

    /**
     * PUT request
     */
    public function put(string $endpoint, array $data = []): array
    {
        return $this->request('PUT', $this->buildUrl($endpoint), $data);
    }

    /**
     * DELETE request
     */
    public function delete(string $endpoint): array
    {
        return $this->request('DELETE', $this->buildUrl($endpoint));
    }

    /**
     * Core request handler
     */
    protected function request(string $method, string $url, array $data = []): array
    {
        $ch = curl_init();

        $defaultHeaders = [
            'Content-Type: application/json',
            'Accept: application/json',
        ];

        $headers = array_merge($defaultHeaders, $this->headers);

        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => $this->timeout,
        ];

        if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }

        curl_setopt_array($ch, $options);

        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => false,
                'status' => 0,
                'message' => 'cURL error: ' . $error,
                'data' => null,
            ];
        }

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($response, true);

        return [
            'success' => $status >= 200 && $status < 300,
            'status'  => $status,
            'data'    => $decoded ?? $response,
        ];
    }

    /**
     * Build full URL
     */
    protected function buildUrl(string $endpoint, array $query = []): string
    {
        $url = $this->baseUrl . $endpoint;

        if (!empty($query)) {
            $url .= '?' . http_build_query($query);
        }

        return $url;
    }

    /**
     * Normalize headers array
     */
    protected function normalizeHeaders(array $headers): array
    {
        $normalized = [];

        foreach ($headers as $key => $value) {
            if (is_string($key)) {
                $normalized[] = "{$key}: {$value}";
            } else {
                $normalized[] = $value;
            }
        }

        return $normalized;
    }
}