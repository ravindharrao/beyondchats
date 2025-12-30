<?php

use App\Http\Controllers\ArticleController;

return [
    [
        'pattern' => '/articles',
        'method' => 'GET',
        'handler' => [ArticleController::class, 'index'],
    ],
    [
        'pattern' => '/articles/{id}',
        'method' => 'GET',
        'handler' => [ArticleController::class, 'show'],
    ],
    [
        'pattern' => '/articles',
        'method' => 'POST',
        'handler' => [ArticleController::class, 'store'],
    ],
    [
        'pattern' => '/articles/{id}',
        'method' => 'PUT',
        'handler' => [ArticleController::class, 'update'],
    ],
    [
        'pattern' => '/articles/{id}',
        'method' => 'DELETE',
        'handler' => [ArticleController::class, 'destroy'],
    ],
    [
        'pattern' => '/articles/scrape',
        'method' => 'POST',
        'handler' => [ArticleController::class, 'scrape'],
    ],
];
