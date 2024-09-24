window.onload = function(){
    console.log("web cargada")
    /*//////////////// VARIABLES GLOBALES ////////////////////*/
    
    var canciones;                                                          // Creo un contenedor de canciones
    var plantilla = document.querySelector("#cancion")                      // Cargo la plantilla-template de HTML
    var destino = document.querySelector("#canciones")                      // Cargo en memoria compartida el destino de las canciones
    
    /*//////////////// VARIABLES GLOBALES ////////////////////*/
    
    /*//////////////// CARGA INICIAL ////////////////////*/
    
    fetch("canciones.json")                                                 // LLamo a un origen de datos
    .then(function(response){                                               // Cuando obtengo respuesta
        return response.json()                                              // Convierto la respuesta a JSON
    })
    .then(function(datos){                                                  // Y a continuación
        canciones = datos                                                   // Asigno la respuesta a la variable global canciones
        console.log(datos)                                                  // Lo saco por consola
        
        datos.forEach(function(dato){                                       // Para cada una de las canciones
            let instancia = document.importNode(plantilla.content,true);    // Instancio la plantilla
            instancia.querySelector("h3").innerHTML = dato.titulo           // Le adapto el titulo
            instancia.querySelector("h4").innerHTML = dato.artista          // Le adapto el arista
            instancia.querySelector("p").innerHTML = dato.significado       // Le adapto el contenido
            destino.appendChild(instancia);                                 // Y lo añado a la seccion (el destino)
        })
    })
    
    /*//////////////// CARGA INICIAL ////////////////////*/
    
    /*//////////////// BUSCADOR ////////////////////*/
    
    let buscador = document.querySelector("#buscador")                      // Selecciono el buscador
    buscador.onkeyup = function(){                                          // Cuando despulso una tecla sobre el buscador
        document.querySelector("#canciones").innerHTML = ""                 // Primero vacío la sección
        let valor = this.value                                              // Atrapo el valor del input
        canciones.forEach(function(cancion){                                // Y para cada una de las canciones
            if(valor == cancion.titulo || valor == cancion.artista){        // Si coincide titulo o artista, solo en ese caso:
                let instancia = document.importNode(plantilla.content,true);// Instancio la plantilla
                instancia.querySelector("h3").innerHTML = cancion.titulo    // Le pongo el titulo
                instancia.querySelector("h4").innerHTML = cancion.artista   // Le pongo el artista
                instancia.querySelector("p").innerHTML = cancion.significado// Le pongo el significado
                destino.appendChild(instancia);                             // Y lo añado al destino
            }
        })
    }
    
    /*//////////////// BUSCADOR ////////////////////*/
}