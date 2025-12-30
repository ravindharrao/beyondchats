<?php

return [
    'default' => 'mongodb',
    
    'connections' => [
        'mongodb' => [
            'driver' => 'mongodb',
            'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
            'port' => (int)($_ENV['DB_PORT'] ?? 27017),
            'database' => $_ENV['DB_DATABASE'] ?? 'beyondchats',
            'username' => $_ENV['DB_USERNAME'] ?? null,
            'password' => $_ENV['DB_PASSWORD'] ?? null,
            'options' => [
                'database' => $_ENV['DB_DATABASE'] ?? 'beyondchats',
            ],
        ],
    ],
];

