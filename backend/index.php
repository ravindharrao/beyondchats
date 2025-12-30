<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Router;
use Illuminate\Events\Dispatcher;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

// MongoDB is initialized through Article model when needed
// No need for Eloquent setup with MongoDB

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple routing
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove /api prefix if present
if (strpos($requestUri, '/api') === 0) {
    $requestUri = substr($requestUri, 4);
}

// Route handling
$routes = require __DIR__ . '/routes/api.php';

// Simple route matching
$matched = false;
foreach ($routes as $route) {
    $pattern = $route['pattern'];
    $method = $route['method'];
    $handler = $route['handler'];
    
    // Convert Laravel route pattern to regex
    $pattern = str_replace('/', '\/', $pattern);
    $pattern = preg_replace('/\{(\w+)\}/', '([^\/]+)', $pattern);
    $pattern = '/^' . $pattern . '$/';
    
    if (preg_match($pattern, $requestUri, $matches) && $method === $requestMethod) {
        array_shift($matches); // Remove full match
        
        // Get request data
        $requestData = [];
        if (in_array($requestMethod, ['POST', 'PUT'])) {
            $rawInput = file_get_contents('php://input');
            $requestData = json_decode($rawInput, true) ?? [];
        }
        
        // Create a simple request object
        $request = new class($requestData, $matches) {
            private $data;
            private $params;
            
            public function __construct($data, $params) {
                $this->data = $data;
                $this->params = $params;
            }
            
            public function validate($rules) {
                return $this->data;
            }
            
            public function all() {
                return array_merge($this->data, $this->params);
            }
        };
        
        // Call the handler
        $controller = new $handler[0]();
        $args = array_merge([$request], $matches);
        $response = call_user_func_array([$controller, $handler[1]], $args);
        
        if ($response instanceof Response) {
            $response->send();
        } else {
            echo json_encode($response);
        }
        
        $matched = true;
        break;
    }
}

if (!$matched) {
    http_response_code(404);
    echo json_encode(['error' => 'Route not found', 'uri' => $requestUri, 'method' => $requestMethod]);
}

