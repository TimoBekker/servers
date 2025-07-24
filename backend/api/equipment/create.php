<?php
require_once '../../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? null;
$description = $data['description'] ?? null;
$status = $data['status'] ?? null;

if (!$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing name']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO equipment (name, description, status) VALUES (:name, :description, :status) RETURNING *");
    $stmt->execute([
        ':name' => $name,
        ':description' => $description,
        ':status' => $status
    ]);
    $newEquipment = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($newEquipment);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}