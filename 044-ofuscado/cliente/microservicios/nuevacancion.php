<?php


    $jsonFile = 'usuarios.json';
    $jsonData = file_get_contents($jsonFile);
    $users = json_decode($jsonData, true);
    $usuario = $_GET['usuario'];
    $contrasena = $_GET['contrasena'];

    function check_credentials($users, $usuario) {
        foreach ($users as $user) {
            if ($user['usuario'] === $usuario) {
                return true;
            }
        }
        return false;
    }

    if (check_credentials($users, base64_decode($usuario))) {
        $jsonFilePath = 'canciones.json';
        $jsonData = file_get_contents($jsonFilePath);
        $cancionesArray = json_decode($jsonData, true);
        $newSong = [
            'titulo' => $_GET['titulo'],
            'artista' => $_GET['artista'],
            'significado' => $_GET['significado'],
            'usuario' => base64_decode($_GET['usuario'])
        ];
        $cancionesArray[] = $newSong;
        $newJsonData = json_encode($cancionesArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($jsonFilePath, $newJsonData);
    } else {
        
    }

    
    
?>