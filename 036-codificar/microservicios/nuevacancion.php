<?php

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
    
?>