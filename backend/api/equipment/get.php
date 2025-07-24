<?php
require_once '../../config.php';

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing id']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM equipment WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $equipment = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$equipment) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }
    echo json_encode($equipment);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}