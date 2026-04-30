<?php

namespace App\Support;

class ApiClient
{
    /**
     * Base URL for redsky-api
     */
    protected static string $baseUrl;

    /**
     * Initialize base URL from config or env
     */
    protected static function baseUrl(): string
    {
        if (!isset(self::$baseUrl)) {
            self::$baseUrl = rtrim(config('api.base_url'), '/');
        }

        return self::$baseUrl;
    }

    /**
     * Send POST request to API
     */
    public static function post(string $endpoint, array $data = [], array $headers = []): array
    {
        return self::request('POST', $endpoint, $data, $headers);
    }

    /**
     * Send GET request to API
     */
    public static function get(string $endpoint, array $query = [], array $headers = []): array
    {
        $url = self::baseUrl() . $endpoint;

        if (!empty($query)) {
            $url .= '?' . http_build_query($query);
        }

        return self::request('GET', $url, [], $headers, false);
    }

    /**
     * Core HTTP request handler
     */
    protected static function request(
        string $method,
        string $endpoint,
        array $data = [],
        array $headers = [],
        bool $prependBase = true
    ): array {
        $url = $prependBase
            ? self::baseUrl() . $endpoint
            : $endpoint;

        $ch = curl_init();

        $defaultHeaders = [
            'Content-Type: application/json',
            'Accept: application/json',
        ];

        $headers = array_merge($defaultHeaders, $headers);

        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
        ];

        if ($method === 'POST') {
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }

        curl_setopt_array($ch, $options);

        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => false,
                'message' => 'cURL error: ' . $error
            ];
        }

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($response, true);

        return [
            'success' => $status >= 200 && $status < 300,
            'status'  => $status,
            'data'    => $decoded ?? $response
        ];
    }
    
}