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
            if(
                reemplazaTildes(cancion.titulo).toLowerCase().includes(reemplazaTildes(valor).toLowerCase()) 
                || 
                reemplazaTildes(cancion.artista).toLowerCase().includes(reemplazaTildes(valor).toLowerCase())
                ||
                reemplazaTildes(cancion.significado).toLowerCase().includes(reemplazaTildes(valor).toLowerCase())
            ){        // Si coincide titulo o artista, solo en ese caso:
                let instancia = document.importNode(plantilla.content,true);// Instancio la plantilla
                instancia.querySelector("h3").innerHTML = cancion.titulo    // Le pongo el titulo
                instancia.querySelector("h4").innerHTML = cancion.artista   // Le pongo el artista
                instancia.querySelector("p").innerHTML = cancion.significado// Le pongo el significado
                destino.appendChild(instancia);                             // Y lo añado al destino
            }
        })
    }
    
    /*//////////////// BUSCADOR ////////////////////*/
    
    /*//////////////// FORMULARIO NUEVA CANCION ////////////////////*/
    
    document.getElementById("nueva").onclick = function(){
        document.getElementById("formularionuevacancion").style.display = "block"
        document.getElementById("formularionuevacancion").classList.add("aparece")
        console.log("ok")
    }
    
    document.getElementById("enviar").onclick = function(){
        let titulo = document.getElementById("titulo").value
        let artista = document.getElementById("artista").value
        let significado = document.getElementById("significado").value
        fetch("./nuevacancion.php?titulo="+encodeURI(titulo)+"&artista="+encodeURI(artista)+"&significado="+encodeURI(significado))
        .then(function(){
            fetch("canciones.json")                                                 // LLamo a un origen de datos
                .then(function(response){                                               // Cuando obtengo respuesta
                    return response.json()                                              // Convierto la respuesta a JSON
                })
                .then(function(datos){                                                  // Y a continuación
                    canciones = datos 
                
                })
            setTimeout(function(){
                document.getElementById("formularionuevacancion").style.display = "none"
            },1000)
            document.getElementById("formularionuevacancion").classList.add("desaparece")
            
        })
    }
    
    /*//////////////// FORMULARIO NUEVA CANCION ////////////////////*/
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