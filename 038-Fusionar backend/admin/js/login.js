window.onload = function(){
    let boton = document.querySelector("button")
    boton.onclick = function(){
        let usuario = document.querySelector("#usuario").value
        let contrasena = document.querySelector("#contrasena").value
        let mensaje = {"usuario":usuario,"contrasena":contrasena}
        console.log(mensaje)
        fetch("../servidor/?o=buscar&tabla=usuarios", {     // Llamo a crear un nuevo registro
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(mensaje)
        })                                                  // Al fetch le envio los datos que quiero insertar
        .then(function(response){
            return response.json()                          // Ahora mismo no hace nada
        })
        .then(function(datos){
            console.log(datos)
            if(datos.length == 0){
                document.querySelector("main").innerHTML += "Error de login";
                setTimeout(function(){
                    window.location = window.location;
                },5000)
                
            }else{
                localStorage.setItem("darkcyan_usuario",datos[0].nombrecompleto)
                setTimeout(function(){
                    window.location = "escritorio.html";
                },1000)
                
            }
        })
    }
}