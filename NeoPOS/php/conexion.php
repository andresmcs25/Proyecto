<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "dbsistema";

$conexion = new mysqli($host, $user, $password, $database);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>
