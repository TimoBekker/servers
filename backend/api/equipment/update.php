<?php
require_once '../../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing id']);
    exit;
}

$fields = [];
$params = [':id' => $id];

if (isset($data['name'])) {
    $fields[] = 'name = :name';
    $params[':name'] = $data['name'];
}
if (isset($data['description'])) {
    $fields[] = 'description = :description';
    $params[':description'] = $data['description'];
}
if (isset($data['status'])) {
    $fields[] = 'status = :status';
    $params[':status'] = $data['status'];
}

if (empty($fields)) {
    http_response_code(400);
    echo json_encode(['error' => 'No fields to update']);
    exit;
}

try {
    $sql = "UPDATE equipment SET " . implode(', ', $fields) . " WHERE id = :id RETURNING *";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $updated = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($updated);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}