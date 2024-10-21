<?php

// Función para minificar el JavaScript
function minificar_js($codigo) {
    // Eliminar comentarios de una sola línea (//) y comentarios en bloque (/* */)
    $codigo = preg_replace('!/\*.*?\*/!s', '', $codigo);
    $codigo = preg_replace('/\n\s*\/\/.*$/m', '', $codigo);
    
    // Eliminar saltos de línea, tabulaciones y espacios en blanco múltiples
    $codigo = preg_replace('/\s+/', ' ', $codigo);

    // Eliminar espacios antes de signos de puntuación
    $codigo = preg_replace('/\s*([{};,:])\s*/', '$1', $codigo);

    return $codigo;
}

// Cargar el archivo JavaScript
$archivo = file_get_contents("comportamiento.js");

// Minificar el código JavaScript
$archivo_minificado = minificar_js($archivo);

// Codificar el archivo minificado en base64
$archivo_ofuscado = base64_encode($archivo_minificado);

// Salida del código ofuscado
echo " eval(atob('$archivo_ofuscado'));";
?>
