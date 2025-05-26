<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "dbsistema");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT idarticulo, idcategoria, codigo, nombre, stock, descripcion, imagen, condicion FROM articulo";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
    exit;
}

$productos = [];

while($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode($productos);
$conn->close();
?>
