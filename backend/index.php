<?php
// index.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

switch (true) {
    case preg_match('#^/api/equipment/statistics$#', $path):
        require_once 'api/equipment/statistics.php';
        break;
    case preg_match('#^/api/equipment/([0-9]+)$#', $path, $matches):
        $_GET['id'] = $matches[1];
        if ($method === 'GET') require_once 'api/equipment/get.php';
        elseif ($method === 'PUT') require_once 'api/equipment/update.php';
        elseif ($method === 'DELETE') require_once 'api/equipment/delete.php';
        break;
    case preg_match('#^/api/equipment$#', $path):
        if ($method === 'GET') require_once 'api/equipment/list.php';
        elseif ($method === 'POST') require_once 'api/equipment/create.php';
        break;
    // Аналогичные маршруты для /software, /information-systems
    case preg_match('#^/api/health$#', $path):
        require_once 'api/health.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}