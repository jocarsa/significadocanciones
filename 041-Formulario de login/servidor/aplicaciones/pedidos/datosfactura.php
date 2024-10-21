<?php

$mysqli = mysqli_connect("localhost", "negocio", "negocio", "negocio") OR die("Algo ha salido mal");

$peticion = "
    SELECT * FROM pedidos
    WHERE pedidos.Identificador = ".$_GET['id'];
$resultado = mysqli_query($mysqli, $peticion);

while($fila = mysqli_fetch_assoc($resultado)){
    echo json_encode($fila);
}

?>