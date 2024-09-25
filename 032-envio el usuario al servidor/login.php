<?php

    if($_GET['usuario'] == "jocarsa" && $_GET['contrasena'] == "jocarsa"){
        echo '{"resultado":"ok","usuario":"jocarsa"}';
    }else{
        echo '{"resultado":"ko"}';
    }

?>