<?php
header('Content-Type: application/json');
include("conexion.php");

$categoria = $_POST['categoria'];
$codigo = $_POST['codigo'];
$nombre = $_POST['nombre'];
$stock = $_POST['stock'];
$descripcion = $_POST['descripcion'];

$imagen = null;
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
    $imagen = 'uploads/' . basename($_FILES['imagen']['name']);
    move_uploaded_file($_FILES['imagen']['tmp_name'], $imagen);
}

$sql = "INSERT INTO articulo (idcategoria, codigo, nombre, stock, descripcion, condicion, imagen)
        VALUES ('$categoria', '$codigo', '$nombre', '$stock', '$descripcion', 1, '$imagen')";

if ($conexion->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}
?>
