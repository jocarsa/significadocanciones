<?php

    $archivo = file_get_contents("comportamiento.js");
    $archivo_ofuscado = base64_encode($archivo);
    echo "
    eval(atob('$archivo_ofuscado'));
    ";
?>