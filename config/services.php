<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Services Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for AI services used in the application.
    | You can configure different AI providers here.
    |
    */

    'ai' => [
        'provider' => env('AI_PROVIDER', 'openai'),
        'endpoint' => env('AI_ENDPOINT', 'https://api.openai.com/v1/chat/completions'),
        'api_key' => env('AI_API_KEY'),
        'model' => env('AI_MODEL', 'gpt-3.5-turbo'),
        'max_tokens' => env('AI_MAX_TOKENS', 1000),
        'temperature' => env('AI_TEMPERATURE', 0.7),
        'timeout' => env('AI_TIMEOUT', 30),
    ],

];
