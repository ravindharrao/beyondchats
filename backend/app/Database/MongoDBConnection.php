<?php

namespace App\Database;

use MongoDB\Client;
use MongoDB\Database;

class MongoDBConnection
{
    private static $client = null;
    private static $database = null;

    public static function getClient()
    {
        if (self::$client === null) {
            $uri = $_ENV['MONGODB_URI'] ?? self::buildUri();
            self::$client = new Client($uri);
        }
        return self::$client;
    }

    public static function getDatabase()
    {
        if (self::$database === null) {
            $dbName = $_ENV['DB_DATABASE'] ?? 'beyondchats';
            self::$database = self::getClient()->selectDatabase($dbName);
        }
        return self::$database;
    }

    private static function buildUri()
    {
        $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $port = $_ENV['DB_PORT'] ?? 27017;
        $database = $_ENV['DB_DATABASE'] ?? 'beyondchats';
        $username = $_ENV['DB_USERNAME'] ?? null;
        $password = $_ENV['DB_PASSWORD'] ?? null;

        if ($username && $password) {
            return "mongodb://{$username}:{$password}@{$host}:{$port}/{$database}";
        }
        
        return "mongodb://{$host}:{$port}/{$database}";
    }
}

