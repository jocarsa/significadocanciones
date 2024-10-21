<?php

include "Clases/ConexionDB.php";                                        // Incluyo la clase que gestiona la base de datos
include "Clases/Mail.php";                                        // Incluyo la clase que gestiona la base de datos

$Conexion = new ConexionDB(
    "localhost", 
    "negocio", 
    "negocio", 
    "negocio"
);

$Mail = new Mail();

if(isset($_GET['o'])){                                                  // Si cuando alguien me llama usa el parametro O
    switch($_GET['o']){                                                 // atrapo los posibles valores de O
        case "listadotablas":                                           // en el caso de que la operacion sea listar tablas
            echo $Conexion->listadoTablas();                            // En el objeto llamo al metodo de listado de tablas
            break;                                                      // Salgo del bucle
        case "tabla":                                                   // en el caso de que pida una tabla
            echo $Conexion->tabla($_GET['tabla']);                      // Llamo al metodo tabla
            break;
        case "eliminar":                                                // en el caso de que quiera eliminar
            echo $Conexion->eliminar($_GET['tabla'],$_GET['id']);       // Llamo al metodo eliminr
            break;
        case "insertar":                                                // en el caso de que quiera insertar
            $json = file_get_contents('php://input');                   // Recojo los datos que vienen en json
            $datos = json_decode($json, true);                          // Los datos que vienen los transformo de json a array de php
            echo $Conexion->insertar($_GET['tabla'],$datos);            // Llamo al metodo insertar
            break;
        case "actualizar":                                                // en el caso de que quiera actualizar
            $json = file_get_contents('php://input');                   // Recojo los datos que vienen en json
            $datos = json_decode($json, true);                          // Los datos que vienen los transformo de json a array de php
            echo $Conexion->actualizar($_GET['tabla'],$datos);            // Llamo al metodo actualizar
            break;
        case "columnas":                                                   // en el caso de que pida una tabla
            echo $Conexion->listadoColumnas($_GET['tabla']);                      // Llamo al metodo tabla
            break;
        case "listaRestricciones":                                                   // en el caso de que pida una tabla
            echo $Conexion->listaRestricciones();                      // Llamo al metodo tabla
            break;
        case "peticionAgrupada":                                                   // en el caso de que pida una tabla
            $json = file_get_contents('php://input');                   // Recojo los datos que vienen en json
            $datos = json_decode($json, true);
            echo $Conexion->peticionAgrupada($datos);                      // Llamo al metodo tabla
            break;
        case "buscar":                                                   // en el caso de que pida una tabla
            $json = file_get_contents('php://input');                   // Recojo los datos que vienen en json
            $datos = json_decode($json, true);
            echo $Conexion->buscar($_GET['tabla'],$datos);                      // Llamo al metodo tabla
            break;
        case "buscarRelajado":                                                   // en el caso de que pida una tabla
            $json = file_get_contents('php://input');                   // Recojo los datos que vienen en json
            $datos = json_decode($json, true);
            echo $Conexion->buscarRelajado($_GET['tabla'],$datos);                      // Llamo al metodo tabla
            break;
        case "mail":                                                   // en el caso de que pida una tabla
            $json = file_get_contents('php://input');                   // Recojo los datos que vienen en json
            $datos = json_decode($json, true);
            echo $Mail->enviarMail($datos);                      // Llamo al metodo tabla
            break;
        default:                                                        // En caso de que la operacion no este reconocida
            echo '{"resultado":"ko"}';                                  // Devuelve un mensaje negativo
            break;
    }
  
}
?>