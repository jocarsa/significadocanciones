<?php

    class Mail{
        /*/////////////////////////////////// DECLARACIÓN DE PROPIEDADES ///////////////////////////////////////////*/
        
       
        
        /*/////////////////////////////////// DECLARACIÓN DE PROPIEDADES ///////////////////////////////////////////*/
        
        /*/////////////////////////////////// MÉTODO CONSTRUCTOR ///////////////////////////////////////////*/
        
        public function __construct(
            
        ){
            
        }
        
        /*/////////////////////////////////// MÉTODO CONSTRUCTOR ///////////////////////////////////////////*/
        
        /*/////////////////////////////////// MÉTODOS DE LA CLASE ///////////////////////////////////////////*/
        
        public function enviarMail($datos){//////////////////////////////// MÉTODO DE LISTADO DE TABLAS
            $to      = 'info@josevicentecarratala.com'; 
            $subject = 'Mensaje desde la web de JOCARSA de '.$datos['nombre'];
            $message = $datos['mensaje']; 
            $headers = 'From: '.$datos['email'] . "\r\n" . 
           'X-Mailer: PHP/' . phpversion(); 
            if(mail($to, $subject, $message, $headers)) {
                return json_encode('{"resultado":"ok"}');
            } else {
                return json_encode('{"resultado":"ko"}');
            }
        }
        
        /*/////////////////////////////////// MÉTODOS DE LA CLASE ///////////////////////////////////////////*/
    }

?>