//localStorage.setItem("usuario","jocarsa");

console.log(localStorage.getItem("usuario"));

var servidor = "./microservicios/";

window.onload = function(){
    console.log("web cargada")
    /*//////////////// VARIABLES GLOBALES ////////////////////*/
    
    var plantilla = document.querySelector("#cancion")                      // Cargo la plantilla-template de HTML
    var destino = document.querySelector("#canciones")                      // Cargo en memoria compartida el destino de las
    
    var canciones;                                                          // Creo un contenedor de canciones
    var plantilla = document.querySelector("#cancion")                      // Cargo la plantilla-template de HTML
    var destino = document.querySelector("#canciones")                      // Cargo en memoria compartida el destino de las canciones
    
    /*//////////////// VARIABLES GLOBALES ////////////////////*/
    
    /*//////////////// CARGA INICIAL ////////////////////*/
    
    fetch(servidor+"canciones.json")                                                 // LLamo a un origen de datos
    .then(function(response){                                               // Cuando obtengo respuesta
        return response.json()                                              // Convierto la respuesta a JSON
    })
    .then(function(datos){                                                  // Y a continuación
        canciones = datos                                                   // Asigno la respuesta a la variable global canciones
        console.log(datos)                                                  // Lo saco por consola
        
        canciones.forEach(function(cancion){                                       // Para cada una de las canciones
            cargaCancion(cancion,plantilla,destino)
        })
    })
    
    /*//////////////// CARGA INICIAL ////////////////////*/
    
    
    
    /*//////////////// BUSCADOR ////////////////////*/
    
    let buscador = document.querySelector("#buscador")                      // Selecciono el buscador
    buscador.onkeyup = function(){                                          // Cuando despulso una tecla sobre el buscador
        document.querySelector("#canciones").innerHTML = ""                 // Primero vacío la sección
        let valor = this.value                                              // Atrapo el valor del input
        canciones.forEach(function(cancion){                                // Y para cada una de las canciones
            if(
                reemplazaTildes(cancion.titulo).toLowerCase().includes(reemplazaTildes(valor).toLowerCase()) 
                || 
                reemplazaTildes(cancion.artista).toLowerCase().includes(reemplazaTildes(valor).toLowerCase())
                ||
                reemplazaTildes(cancion.significado).toLowerCase().includes(reemplazaTildes(valor).toLowerCase())
            ){        // Si coincide titulo o artista, solo en ese caso:
                cargaCancion(cancion,plantilla,destino)
            }
        })
    }
    
    /*//////////////// BUSCADOR ////////////////////*/
    
    /*//////////////// FORMULARIO NUEVA CANCION ////////////////////*/
    
    document.getElementById("nueva").onclick = function(){
        document.getElementById("modal").style.display = "block"
        document.getElementById("modal").classList.add("aparece")
        console.log("ok")
        if(localStorage.getItem("usuario") == undefined){
            document.getElementById("formularionuevacancion").style.display = "none"
            document.getElementById("formulariologin").style.display = "block"
        }else{
            document.getElementById("formularionuevacancion").style.display = "block"
            document.getElementById("formulariologin").style.display = "none"
        }
    }
   
    document.getElementById("enviar").onclick = function(){
        let titulo = document.getElementById("titulo").value
        let artista = document.getElementById("artista").value
        let significado = document.getElementById("significado").value
        fetch(servidor+"nuevacancion.php?titulo="+encodeURI(titulo)+"&artista="+encodeURI(artista)+"&significado="+encodeURI(significado)+"&usuario="+localStorage.getItem("usuario"))
        .then(function(){
            fetch(servidor+"canciones.json")                                                 // LLamo a un origen de datos
                .then(function(response){                                               // Cuando obtengo respuesta
                    return response.json()                                              // Convierto la respuesta a JSON
                })
                .then(function(datos){                                                  // Y a continuación
                    canciones = datos 
                
                })
            setTimeout(function(){
                document.getElementById("modal").style.display = "none"
            },1000)
            document.getElementById("modal").classList.add("desaparece")
            
        })
       
    }
    
    /*//////////////// FORMULARIO NUEVA CANCION ////////////////////*/
    
    /*//////////////// LOGIN ////////////////////*/
    
    document.getElementById("login").onclick = function(){
        let usuario = document.getElementById("usuario").value
        let contrasena = document.getElementById("contrasena").value
        
        fetch(servidor+"login.php?usuario="+usuario+"&contrasena="+contrasena)
        .then(function(response){                                               // Cuando obtengo respuesta
                return response.json()                                              // Convierto la respuesta a JSON
            })
            .then(function(datos){                                                  // Y a continuación
                if(datos.resultado == "ok"){
                    localStorage.setItem("usuario",datos.usuario);
                    document.getElementById("formularionuevacancion").style.display = "block"
                    document.getElementById("formulariologin").style.display = "none"
                }else{
                    document.getElementById("retroalimentacion").innerHTML = "Intento de acceso incorrecto"
                }
            })
    }
    
    
    /*//////////////// LOGIN ////////////////////*/
    
  
}


function reemplazaTildes(sujeto){
    // Esta función reemplaza las tildes para facilitar la búsqueda
    resultado = sujeto.replace("á","a")
        .replace("é","e")
        .replace("í","i")
        .replace("ó","o")
        .replace("ú","u")
    return resultado
}


function cargaCancion(cancion,plantilla,destino){
    
    let instancia = document.importNode(plantilla.content,true);    // Instancio la plantilla
    
    instancia.querySelector("h3").innerHTML = cancion.titulo           // Le adapto el titulo
    instancia.querySelector("h4").innerHTML = cancion.artista          // Le adapto el arista
    instancia.querySelector("p").innerHTML = cancion.significado       // Le adapto el contenido
    instancia.querySelector("h5").innerHTML = "por: "+cancion.usuario       // Le adapto el contenido

    
    instancia.querySelector("article").onclick = function(){
        let articulos = document.querySelectorAll("article")
        articulos.forEach(function(articulo){
            //articulo.classList.remove("alturacompleta")
            articulo.style.display = "none"
        })
        this.style.display = "block"
        this.classList.add("alturacompleta")
    }
    
    destino.appendChild(instancia);                                 // Y lo añado a la seccion (el destino)
}