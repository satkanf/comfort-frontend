<?php
/**
 * WordPress CORS Setup for React App Development
 * Добавьте этот код в functions.php вашей темы WordPress
 */

// Разрешить CORS для локальной разработки
add_action('init', 'allow_cors_for_localhost');
function allow_cors_for_localhost() {
    // Разрешить запросы с localhost:8080 (Vite dev server)
    $allowed_origins = array(
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:3000',  // Альтернативный порт
        'http://127.0.0.1:3000',
        'https://comfort.satkan.site' // Для продакшена
    );

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
        header("Access-Control-Allow-Credentials: true");
    }
}

// Обработка preflight OPTIONS запросов
add_action('init', 'handle_preflight_requests');
function handle_preflight_requests() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            $allowed_origins = array(
                'http://localhost:8080',
                'http://127.0.0.1:8080',
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'https://comfort.satkan.site'
            );

            if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
                header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
                header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
                header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
                header("Access-Control-Allow-Credentials: true");
                header("Access-Control-Max-Age: 86400"); // Кэшировать на 24 часа
                exit(0);
            }
        }
    }
}

// Дополнительные CORS заголовки для REST API
add_filter('rest_pre_serve_request', 'add_cors_http_header');
function add_cors_http_header() {
    $allowed_origins = array(
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://comfort.satkan.site'
    );

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
        header("Access-Control-Allow-Credentials: true");
    }
}

// Разрешить CORS для всех REST API эндпоинтов
add_action('rest_api_init', 'setup_cors_for_rest_api');
function setup_cors_for_rest_api() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $allowed_origins = array(
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://comfort.satkan.site'
        );

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
            header("Access-Control-Allow-Credentials: true");
        }

        return $value;
    });
}

// Отладочная информация (можно удалить в продакшене)
add_action('wp_head', 'cors_debug_info');
function cors_debug_info() {
    if (current_user_can('administrator') && isset($_GET['debug_cors'])) {
        echo "<!-- CORS Debug Info -->\n";
        echo "<!-- Origin: " . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'Not set') . " -->\n";
        echo "<!-- Method: " . $_SERVER['REQUEST_METHOD'] . " -->\n";
        echo "<!-- URI: " . $_SERVER['REQUEST_URI'] . " -->\n";
        echo "<!-- Allowed Origins: localhost:8080, localhost:3000, comfort.satkan.site -->\n";
    }
}

?>






