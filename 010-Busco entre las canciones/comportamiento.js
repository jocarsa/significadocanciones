window.onload = function(){
    console.log("web cargada")
    /*//////////////// VARIABLES GLOBALES ////////////////////*/
    
    var canciones;                                                      
    var plantilla = document.querySelector("#cancion")
    var destino = document.querySelector("#canciones")
    
    /*//////////////// VARIABLES GLOBALES ////////////////////*/
    
    /*//////////////// CARGA INICIAL ////////////////////*/
    
    fetch("canciones.json")
    .then(function(response){
        return response.json()
    })
    .then(function(datos){
        canciones = datos
        console.log(datos)
        
        datos.forEach(function(dato){
            let instancia = document.importNode(plantilla.content,true);
            instancia.querySelector("h3").innerHTML = dato.titulo
            instancia.querySelector("h4").innerHTML = dato.artista
            instancia.querySelector("p").innerHTML = dato.significado
            destino.appendChild(instancia);
        })
    })
    
    /*//////////////// CARGA INICIAL ////////////////////*/
    
    /*//////////////// BUSCADOR ////////////////////*/
    
    let buscador = document.querySelector("#buscador")
    buscador.onkeyup = function(){
        // Primero vacío la sección
        document.querySelector("#canciones").innerHTML = ""
        console.log(canciones)
        let valor = this.value
        canciones.forEach(function(cancion){
            console.log(cancion.artista)
            console.log(valor)
            if(valor == cancion.titulo || valor == cancion.artista){
                let instancia = document.importNode(plantilla.content,true);
                instancia.querySelector("h3").innerHTML = cancion.titulo
                instancia.querySelector("h4").innerHTML = cancion.artista
                instancia.querySelector("p").innerHTML = cancion.significado
                destino.appendChild(instancia);
            }
        })
    }
    
    /*//////////////// BUSCADOR ////////////////////*/
}