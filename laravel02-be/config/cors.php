<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [],

    'allowed_origins_patterns' => [
        '/^http:\/\/localhost(:\d+)?$/',
        '/^http:\/\/127\.0\.0\.1(:\d+)?$/',
        '/^http:\/\/10\.10\.\d{1,3}\.\d{1,3}(:\d+)?$/', // Mengizinkan semua IP 10.10.x.x
        '/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/', // Mengizinkan semua IP 192.168.x.x
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
