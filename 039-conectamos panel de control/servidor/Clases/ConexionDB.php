<?php

    class ConexionDB{
        /*/////////////////////////////////// DECLARACIÓN DE PROPIEDADES ///////////////////////////////////////////*/
        
        private $servidor;
        private $usuario;
        private $contrasena;
        private $basededatos;
        private $conexion;
        
        /*/////////////////////////////////// DECLARACIÓN DE PROPIEDADES ///////////////////////////////////////////*/
        
        /*/////////////////////////////////// MÉTODO CONSTRUCTOR ///////////////////////////////////////////*/
        
        public function __construct(
            $nuevoservidor,
            $nuevousuario,
            $nuevacontrasena,
            $nuevabd,
        ){
            $this->servidor = $nuevoservidor;
            $this->usuario = $nuevousuario;
            $this->contrasena = $nuevacontrasena;
            $this->basededatos = $nuevabd;
            $this->conexion = mysqli_connect(
                $this->servidor, 
                $this->usuario, 
                $this->contrasena, 
                $this->basededatos
            ) OR die("Algo ha salido mal");
        }
        
        /*/////////////////////////////////// MÉTODO CONSTRUCTOR ///////////////////////////////////////////*/
        
        /*/////////////////////////////////// MÉTODOS DE LA CLASE ///////////////////////////////////////////*/
        
        public function listadoTablas(){//////////////////////////////// MÉTODO DE LISTADO DE TABLAS
            $peticion = "SHOW TABLES";
            $resultado = mysqli_query($this->conexion, $peticion);
            $tablas = [];
            while($fila = mysqli_fetch_assoc($resultado)){
                $tablas[] = $fila;
            }
            return json_encode($tablas);
        }

        public function tabla($tabla){//////////////////////////////// MÉTODO DE CONTENIDO DE UNA TABLA
            
            //////////////////////////////// RESTRICCIONES EXTERNAS /////////////////////
            
            $peticion = "
                SELECT
                    a.TABLE_NAME AS tabla,
                    a.COLUMN_NAME AS columna,
                    a.CONSTRAINT_NAME AS restriccion,
                    a.REFERENCED_TABLE_NAME AS tablareferenciada,
                    a.REFERENCED_COLUMN_NAME AS columnareferenciada
                FROM
                    INFORMATION_SCHEMA.KEY_COLUMN_USAGE a
                WHERE
                    a.REFERENCED_TABLE_NAME IS NOT NULL
                    AND a.TABLE_SCHEMA = '".$this->basededatos."'
                    AND a.TABLE_NAME = '".$tabla."';
            ";                                                                 // Quiero averiguar la estructura de relaciones EXTERNAS de la tabla

            $resultado = mysqli_query($this->conexion, $peticion);              // Lanzo la petición
            $estructura = [];                                                   // Creo un array vacio
            while($fila = mysqli_fetch_assoc($resultado)){                      // Para cada uno de los resultados
                $estructura[] = $fila;                                          // Lo añado al array
            }
            
            //////////////////////////////// LISTADO DE COLUMNAS /////////////////////
            
            $peticion = "
                SHOW COLUMNS FROM ".$tabla.";
            ";                                                                  // Ahora quiero saber qué columnas tiene la tabla
            $resultado = mysqli_query($this->conexion, $peticion);              // Lanzo la petición contra la base de datos
            $columnas = [];                                                     // Creo un arreglo vacío
            while($fila = mysqli_fetch_assoc($resultado)){                      // Para cada uno de los resultados
                $columnas[] = $fila;                                            // Lo añado al array
            }
            
            //////////////////////////////// CREO UNA PETICIÓN CON JOIN DE FORMA DINÁMICA /////////////////////
            
            $peticion = "SELECT ";                                              // Empiezo a crear una peticion
            
            //////////////////////////////// VAMOS CON LOS CAMPOS /////////////////////
            
            foreach($columnas as $clave=>$valor){                               // Para cada una de las columnas
                $externo = false;                                               // En principio cuento con que la relación no es externa
                foreach($estructura as $clave2=>$valor2){                       // Para cada una de las estructuras
                    if($valor2['columna'] == $valor['Field']){                  // comparo si la columna está en la lista de relacions externa
                       $externo = true;                                         // En ese caso declaro que la relacion es externa
                       $tablareferenciada =  $valor2['tablareferenciada'];      // Indico el nombre de la tabla referenciada
                        $columnareferenciada = explode("_",$valor2['columna'])[1];  // Indico el nombre de la columna referenciada
                    }
                }
                if($externo == false){                                          // Si la columna no es externa
                   $peticion .= $tabla.".".$valor['Field'].",";                 // Simplemente ponme el nombre de la columna
                }else{                                                          // Pero si es externa
                    $peticion .= $tablareferenciada.".".$columnareferenciada." AS ".$valor['Field'].",";   // En ese caso ponme el nombre de la columna externa
                }
            }
            $peticion = substr($peticion, 0, -1);
            $peticion .= " FROM ".$tabla." ";
            
            //////////////////////////////// VAMOS CON LOS JOIN /////////////////////
            
            foreach($columnas as $clave=>$valor){                               // PAra cada una de las columnas
                foreach($estructura as $clave2=>$valor2){                       // REpaso cada una de las relaciones externas
                    if($valor2['columna'] == $valor['Field']){                  // Si coinciden
                      $peticion .= "    
                       LEFT JOIN 
                       ".$valor2['tablareferenciada']." 
                       ON ".$tabla.".".$valor['Field']." 
                       =  ".$valor2['tablareferenciada'].".".$valor2['columnareferenciada']."
                       ";                                                       // Preparo la peticion de JOIN
                    }
                } 
            }
            
            //////////////////////////////// EJECUTAMOS CONTRA LA BASE DE DATOS /////////////////////
            
            $resultado = mysqli_query($this->conexion, $peticion);                  // Ejecuto contra la base de datos
            $tablas = [];                                                           // Creo un array vacio
            while($fila = mysqli_fetch_assoc($resultado)){                          // Resultado a resultado 
                $tablas[] = $fila;                                                  // lo meto en el array
            }
            return json_encode($tablas);                                            // Lo devuelvo hacia el cliente en formato JSON
            //return $peticion;

        }
        public function eliminar($tabla,$id){//////////////////////////////// MÉTODO DE ELIMINAR REGISTRO DE TABLA
            $peticion = "DELETE FROM ".$tabla." WHERE Identificador = ".$id.";";    // Ejecuta una petición en la cual apunta a la tabla indicando el id
            $resultado = mysqli_query($this->conexion, $peticion);                  // Lanzo la petición contra el servidor
            return '{"resultado":"'.$peticion.'"}';                                 // DEvuelvo un json de ok
        }

        public function insertar($tabla,$datos){//////////////////////////////// MÉTODO DE INSERTAR CONTENIDO EN TABLA

            $columnas = implode(", ", array_keys($datos));                          // Tomo las columnas en array y las convierto a string con separador
            $valores = implode("', '", array_map([$this->conexion, 'real_escape_string'], array_values($datos))); // Tomo los datos en array y las convierto a string con separador
            $peticion = "INSERT INTO ".$tabla." (".$columnas.") VALUES ('".$valores."')";   // Creo una peticion
             //echo $peticion;
            $resultado = mysqli_query($this->conexion, $peticion);                  // Ejecuto la peticion contra el servidor
           
            $peticion = "SELECT Identificador FROM ".$tabla." ORDER BY Identificador DESC LIMIT 1";
            $resultado = mysqli_query($this->conexion, $peticion);
            while($fila = mysqli_fetch_assoc($resultado)){                          // Resultado a resultado 
                $id = $fila['Identificador'];                                                  // lo meto en el array
            }
            echo '{"resultado":"ok","identificador":'.$id.'}';                                              // Devuelvo un json de ok
        }

        public function actualizar($tabla,$datos){//////////////////////////////// MÉTODO DE ACTUALIZAR UN DATO DE UNA TABLA

            $peticion = "
            UPDATE ".$datos['tabla']." 
            SET ".$datos['columna']."='".$datos['valor']."' 
            WHERE Identificador = ".$datos['identificador'].";
            ";                                                                      // Preparo una peticion de actualizacion
            $resultado = mysqli_query($this->conexion, $peticion);                  // Ejecuto la peticion contra la base de datos
            echo '{"resultado":"'.$peticion.'"}';                                   // Devuelvo un json
        }
        public function listadoColumnas($tabla){ //////////////////////////////// MÉTODO DE SOLO DAME LAS COLUMNAS
            $peticion = "
                SHOW COLUMNS FROM ".$tabla.";
            ";                                                                  // Ahora quiero saber qué columnas tiene la tabla
            $resultado = mysqli_query($this->conexion, $peticion);              // Lanzo la petición contra la base de datos
            $columnas = [];                                                     // Creo un arreglo vacío
            while($fila = mysqli_fetch_assoc($resultado)){                      // Para cada uno de los resultados
                $columnas[] = $fila;                                            // Lo añado al array
            }
            return json_encode($columnas);
        }
        public function buscar($tabla,$datos){ //////////////////////////////// BUSCAR
            
            $peticion = "
                SELECT * FROM ".$tabla." WHERE
            ";                                                                  // Ahora quiero saber qué columnas tiene la tabla
            
            foreach($datos as $clave=>$valor){
                $peticion .= $clave."='".$valor."' AND ";
            }
            $peticion .= " 1;";
            //echo $peticion;
            $resultado = mysqli_query($this->conexion, $peticion);              // Lanzo la petición contra la base de datos
            $columnas = [];                                                     // Creo un arreglo vacío
            while($fila = mysqli_fetch_assoc($resultado)){                      // Para cada uno de los resultados
                $columnas[] = $fila;                                            // Lo añado al array
            }
            return json_encode($columnas);
        }
        public function buscarRelajado($tabla,$datos){ //////////////////////////////// BUSCAR
            
            $peticion = "
                SELECT * FROM ".$tabla." WHERE
            ";                                                                  // Ahora quiero saber qué columnas tiene la tabla
            
            foreach($datos as $clave=>$valor){
                $peticion .= $clave." LIKE '%".$valor."%' AND ";
            }
            $peticion .= " 1;";
            //echo $peticion;
            $resultado = mysqli_query($this->conexion, $peticion);              // Lanzo la petición contra la base de datos
            $columnas = [];                                                     // Creo un arreglo vacío
            while($fila = mysqli_fetch_assoc($resultado)){                      // Para cada uno de los resultados
                $columnas[] = $fila;                                            // Lo añado al array
            }
            return json_encode($columnas);
        }
        public function listaRestricciones(){ //////////////////////////////// LISTAR RESTRICCIONES
            
            $peticion = "
                SELECT 
                    TABLE_NAME,
                    COLUMN_NAME,
                    CONSTRAINT_NAME,
                    REFERENCED_TABLE_NAME,
                    REFERENCED_COLUMN_NAME
                FROM 
                    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE 
                    TABLE_SCHEMA = '".$this->basededatos."'
                    AND REFERENCED_TABLE_NAME IS NOT NULL;
            ";                                                                  // Ahora quiero saber qué columnas tiene la tabla
            
            
            $resultado = mysqli_query($this->conexion, $peticion);              // Lanzo la petición contra la base de datos
            $columnas = [];                                                     // Creo un arreglo vacío
            while($fila = mysqli_fetch_assoc($resultado)){                      // Para cada uno de los resultados
                $columnas[] = $fila;                                            // Lo añado al array
            }
            return json_encode($columnas);
        }
        
        public function peticionAgrupada($datos){ //////////////////////////////// Peticion agrupada
            try{
                $peticion = "
                    SELECT 
                    ".str_replace("_",".",$datos['columna'])." AS clave ,
                    COUNT(pedidos_fecha) AS valor
                    FROM ".$datos['tabla']."
                    LEFT JOIN ".$datos['tablareferenciada']."
                    ON ".$datos['tabla'].".".$datos['columna']." = ".$datos['tablareferenciada'].".Identificador
                    GROUP BY(".$datos['columna'].")
                    ;
                ";                                                                  // Ahora quiero saber qué columnas tiene la tabla
                

                $resultado = mysqli_query($this->conexion, $peticion);              // Lanzo la petición contra la base de datos
                $columnas = [];                                                     // Creo un arreglo vacío
                while($fila = mysqli_fetch_assoc($resultado)){                      // Para cada uno de los resultados
                    $columnas[] = $fila;                                            // Lo añado al array
                }
                return json_encode($columnas);
            }catch(Exception $e){
                return [];
            }
        }
        /*/////////////////////////////////// MÉTODOS DE LA CLASE ///////////////////////////////////////////*/
    }

?>