<?php


    $jsonFile = 'usuarios.json';
    $jsonData = file_get_contents($jsonFile);
    $users = json_decode($jsonData, true);
    $usuario = $_GET['usuario'];
    $contrasena = $_GET['contrasena'];

    function check_credentials($users, $usuario, $contrasena) {
        foreach ($users as $user) {
            if ($user['usuario'] === $usuario && $user['contrasena'] === $contrasena) {
                return true;
            }
        }
        return false;
    }

    if (check_credentials($users, $usuario, $contrasena)) {
        echo '{"resultado":"ok","usuario":"'.base64_encode($usuario).'"}';
    } else {
        echo '{"resultado":"ko"}';
    }


?>