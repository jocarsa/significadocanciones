window.onload = function(){
    console.log("web cargada")
    /*//////////////// CARGA INICIAL ////////////////////*/
    var canciones;
    fetch("canciones.json")
    .then(function(response){
        return response.json()
    })
    .then(function(datos){
        canciones = datos
        console.log(datos)
        let plantilla = document.querySelector("#cancion")
        let destino = document.querySelector("#canciones")
        let instancia = 
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
    }
    
    /*//////////////// BUSCADOR ////////////////////*/
}