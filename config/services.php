<?php

return [
    'redsky' => [
        'base_url' => 'http://localhost/redsky-api/public',
        'timeout' => 5,
        'headers' => [
            'Accept' => 'application/json'
        ],
    ],

    'payments' => [
        'base_url' => 'https://payments.example.com/api',
        'timeout' => 10,
        'headers' => [
            'X-API-KEY' => 'secret-key'
        ],
    ],
];