window.onload = function(){
    console.log("web cargada")
    fetch("canciones.json")
    .then(function(response){
        return response.json()
    })
    .then(function(datos){
        console.log(datos)
    })
}