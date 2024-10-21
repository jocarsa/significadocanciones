if ('darkcyan_usuario' in localStorage) {
    console.log('pasas');
} else {
    window.location = "index.html"
}

tamaniofuente = 1

window.onload = function(){                                     // Solo ejecuto Javascript cuando el documento haya cargado
    
    ///////////////////////////// HERRAMIENTAS ////////////////////////////////////
    
    document.querySelector("#grande").onclick = function(){
        tamaniofuente *= 1.1
        document.querySelector("body").style.fontSize = tamaniofuente+"em"
    }
    
    document.querySelector("#pequeno").onclick = function(){
        tamaniofuente *= 0.9
        document.querySelector("body").style.fontSize = tamaniofuente+"em"
    }
    ///////////////////////////// HERRAMIENTAS ////////////////////////////////////
    
    ///////////////////////////// GRAFICAS REALES ////////////////////////////////////
    
    fetch("../servidor/?o=listaRestricciones")                                      // Cargo un json con información
    .then(function(response){                                                       // Cauando cargue ese json
        return response.json()                                                      // Convierto la respuesta a json (espero que lo que venga sea json)
    })
    .then(function(datos){                                                          // Cuando el paso anterior haya sido completado
        datos.forEach(function(restriccion){                                        // Para cada una de las restricciones que han llegado
            let mensaje = {                                 
                "columna":restriccion['COLUMN_NAME'],
                "tabla":restriccion['TABLE_NAME'],
                "tablareferenciada":restriccion['REFERENCED_TABLE_NAME']
            }                                                                       // Formateo un mensaje
            fetch("../servidor/?o=peticionAgrupada", {                              // Ahora quiero obtener el count y group by de esa restriccion
                  method: 'POST', 
                  headers: {
                    'Content-Type': 'application/json', 
                  },
                  body: JSON.stringify(mensaje)
                })                                                                  // Cargo un json con información
            .then(function(response2){                                              // Cauando cargue ese json
                return response2.json()                                             // Convierto la respuesta a json (espero que lo que venga sea json)
            })
            .then(function(datos2){
                let objeto = {}                                                     // Creo un objeto para la grafica
                datos2.forEach(function(dato){
                    let clave = dato.clave
                    let valor = parseFloat(dato.valor)
                    objeto[clave] = valor;
                })                                                                  // Para cada uno de los datos, lo pongo en el objeto
                console.log(objeto)
                grafica("graficas",objeto,[0,139,139],'Título de la gráfica');      // A partir de ese objeto, genero la grafica
            }) 
        })
    })
    

    
    ///////////////////////////// GRAFICAS REALES ////////////////////////////////////
    
    
    ///////////////////////////// MENU DE NAVEGACION ////////////////////////////////////
    
    fetch("../servidor/?o=listadotablas")                                        // Cargo un json con información
    .then(function(response){                                   // Cauando cargue ese json
        return response.json()                                  // Convierto la respuesta a json (espero que lo que venga sea json)
    })
    .then(function(datos){                                      // Cuando el paso anterior haya sido completado
        console.log(datos)
        let navegacion = document.querySelector("nav ul")       // Cargo el elemento de lista de la navegacion
        datos.forEach(function(elemento){                       // PAra cada uno de los elementos del conjunto de datos
            let elementomenu = document.createElement("li")     // Creo un elemento li de lista
            elementomenu.textContent = elemento.Tables_in_negocio          // A ese elemento le pongo el nombre de la tabla
            elementomenu.onclick = function(){                  // Y cuando haga click en ese elemento
                cargaTabla(this.textContent)                    // Cargo la tabla correspondiente a ese elemento
                var elementosmenu = document.querySelectorAll("nav ul li")
                elementosmenu.forEach(function(elemento){
                    elemento.classList.remove("seleccionado")
                })
                
                this.classList.add("seleccionado")
            }
            navegacion.appendChild(elementomenu)                // Añado el elemento al menu de navegación
        })
    })
    
    ///////////////////////////// MENU DE NAVEGACION ////////////////////////////////////
      
    ///////////////////////////// MODAL APARECE Y DESAPARECE ////////////////////////////////////

    document.getElementById("crear").onclick = function(){                  // Cuando hago click en crear nuevo elemento
        document.getElementById("contienemodal").classList.remove("desaparece")   // El contiene modal aparece con animacion
        document.getElementById("contienemodal").classList.add("aparece")   // El contiene modal aparece con animacion
        document.getElementById("contienemodal").style.display = "block"    // Se pone visible
    }
    document.getElementById('modal').onclick =  function(event) {           // Cuando hago click en el modal
        event.stopPropagation();                                            // No ocurre nada y no propaga la acción al parent
    }
    document.getElementById("contienemodal").onclick = function(){          // Cuando hago click en el fondo
        document.getElementById("contienemodal").classList.remove("aparece")// LE quito la clase de la animacion
        document.getElementById("contienemodal").classList.add("desaparece")   // Le pongo la clase de aparecer
        setTimeout(function(){                                              // DEspues de un segundo
            document.getElementById("contienemodal").style.display = "none" // Le quito la visibilidad
        },1000)
          
    }

    ///////////////////////////// MODAL APARECE Y DESAPARECE ////////////////////////////////////
    
    ///////////////////////////// ESTILO MENU ////////////////////////////////////
    
    
    
    ///////////////////////////// ESTILO MENU ////////////////////////////////////
}


///////////////////////////// CONTENIDO DE LA TABLA ////////////////////////////////////
    
    function cargaTabla(tabla){                                     // Función que carga el contenido de una tabla
        try{
            document.querySelector("#graficas").remove()
        }catch(error){
            console.log("Las graficas ya no existian")
        }
        let columnascompletas = []
        fetch("../servidor/?o=columnas&tabla="+tabla)
        .then(function(response){                                   // Cauando cargue ese json
            return response.json()                                  // Convierto la respuesta a json (espero que lo que venga sea json)
        })
        .then(function(datos){
            columnascompletas = datos
        })
        var globaltabla = tabla                                     // creo una variable global dentro de la funcion
        document.querySelector("table thead tr").innerHTML = ""     // Vacío la cabecera de la tabla
        document.querySelector("table tbody").innerHTML = ""        // Vacío el cuerpo de la tabla
        document.querySelector("section h3").innerHTML = tabla      // Le pongo nombre al titulo de la tabla                          
        fetch("../servidor/?o=tabla&tabla="+tabla)                  // Cargo un json con información
        .then(function(response){                                   // Cauando cargue ese json
            return response.json()                                  // Convierto la respuesta a json (espero que lo que venga sea json)
        })
        .then(function(datos){                                      // Cuando el paso anterior haya sido completado
            console.log(datos)
            ////////////////////////////////////////////////// TABLA Y FORMULARIO //////////////////////////////////////////////////
            
            let primerregistro = datos[0]                           // Cargo el primer registro de los datos
            let claves = Object.keys(primerregistro)                // Me quedo solo con las columnas (las claves)
            let cabecera = document.querySelector("table thead tr") // Selecciono la cabecera de la tabla
            let cabecerabuscador = document.querySelector("table thead #busca") // Selecciono la cabecera de la tabla
            let modal = document.getElementById("modal")            // Selecciono el modal
            modal.innerHTML = ""                                    // Vacío el modal
            let camposenviar = []                                   // Creo un conjunto para ponerle los campos del formulario
            let titulo = document.createElement("h3")               // Creo un elemento de titulo para el formulario de insercion
            titulo.textContent = "Insertar un nuevo registro en: "+globaltabla  // Le pongo contenido en texto para el titulo del formulario de inserción
            modal.appendChild(titulo)                               // Añado el elemento titulo al formulario
            let seccion = document.createElement("div")             // Creo una sección que va a contener a los campos del formulario
            seccion.setAttribute("class","doscolumnas")             // Le pongo la clase doscolumnas que con css tiene estilo
            cabecerasbuscador = []
            claves.forEach(function(clave){                         // Para cada una de las claves
                let nuevacabecera = document.createElement("th")    // Genero un nuevo table heading
                nuevacabecera.textContent = clave                   // el contenido en texto es el nombre de la clave
                cabecera.appendChild(nuevacabecera)                 // Añado un nuevo elemento a la cabecera
                
                let nuevacabecerabuscador = document.createElement("th")    // Genero un nuevo table heading
                cabecerasbuscador.push(document.createElement("input"))
                cabecerasbuscador[cabecerasbuscador.length-1].setAttribute("type","search")
                cabecerasbuscador[cabecerasbuscador.length-1].setAttribute("placeholder",clave)
                nuevacabecerabuscador.appendChild(cabecerasbuscador[cabecerasbuscador.length-1])
                cabecerabuscador.appendChild(nuevacabecerabuscador)                 // Añado un nuevo elemento a la cabecera
                
                let contenedor = document.createElement("div")      // Creo un pequeño contenedor para cada grupo de texto y campo
                contenedor.setAttribute("class","grupoformulario")  // A ese grupo le añado la clase de grupoformulario
                let texto = document.createElement("p")             // Creo un elemento de parrafo
                texto.textContent = "Introduce el contenido para : "+clave  // Le pongo el texto a ese elemento
                contenedor.appendChild(texto)                       // Al contenedor le añado el texto
                if(clave.includes("_")){
                    let seleccionador = document.createElement("select")
                    seleccionador.setAttribute("placeholder",clave)
                    camposenviar.push(seleccionador)
                    contenedor.appendChild(seleccionador)
                    let tabladestino = clave.split("_")[0]
                    fetch("../servidor/?o=tabla&tabla="+tabladestino)                  // Cargo un json con información
                    .then(function(response){                                   // Cauando cargue ese json
                        return response.json()                                  // Convierto la respuesta a json (espero que lo que venga sea json)
                    })
                    .then(function(datos){                                      // Cuando el paso anterior haya sido completado
                        datos.forEach(function(dato){
                            let cadena = ""
                            let valores = Object.values(dato);
                            valores.forEach(function(trozo){
                                cadena+= trozo+" - ";
                            })
                            let opcion = document.createElement("option")
                            opcion.value=dato.Identificador
                            opcion.textContent = cadena
                            seleccionador.appendChild(opcion)
                        })
                        
                    })
                }else{
                    let entrada = document.createElement("input")       // Creo una nueva entrada para el formulario
                    console.log("vamos a comprobar el tipo de este campo:",clave)
                    columnascompletas.forEach(function(columna){
                        if(clave == columna['Field']){
                            console.log("Tu tipo de datos es: ",columna['Type'])
                            if(columna['Type'].includes("varchar")){
                                entrada.setAttribute("type","text")
                            }else if(columna['Type'].includes("date")){
                                entrada.setAttribute("type","date") 
                            }else if(columna['Type'].includes("int")){
                                entrada.setAttribute("type","number") 
                            }else if(columna['Type'].includes("decimal")){
                                entrada.setAttribute("type","number") 
                            }
                            if(extractNumber(columna['Type']) != null){
                                entrada.setAttribute("maxlength",extractNumber(columna['Type']))
                            }
                        }
                    })
                    camposenviar.push(entrada)                          // Añado el campo al conjunto de campos que he creado antes
                    entrada.setAttribute("placeholder",clave)           // Le añado un atributo a ese campo
                    contenedor.appendChild(entrada)                     // Añado el campo al minicontenedor
                }
                
                seccion.appendChild(contenedor)                     // A la seccion le añado el contenedor
                
            })
            modal.appendChild(seccion)                              // Al modal le añado la seccion
            let columnaoperaciones = document.createElement("th")   // En la cabecera creo una columna vacia para operaciones
            cabecera.appendChild(columnaoperaciones)                // Añado la columna a la cabecera
            
            let columnaaplicaciones = document.createElement("th")   // En la cabecera creo una columna vacia para operaciones
            cabecera.appendChild(columnaaplicaciones)                // Añado la columna a la cabecera
            
            let columnabuscar = document.createElement("th")
            cabecerabuscador.appendChild(columnabuscar)
            
            let botonbuscar = document.createElement("button")
            botonbuscar.textContent = "🔎"
            columnabuscar.appendChild(botonbuscar)
            botonbuscar.onclick = function(){
                console.log("vamos a buscar")
                console.log(cabecerasbuscador)
                let mensaje = {}
                cabecerasbuscador.forEach(function(cabecera){
                    if(cabecera.value != ""){
                        mensaje[cabecera.getAttribute("placeholder")] = cabecera.value
                    }
                })
                console.log(mensaje)
                fetch("../servidor/?o=buscarRelajado&tabla="+globaltabla, {     // lLamo a crear un nuevo registro
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
                    cargaResultados(globaltabla,datos)
                })
            }
            
            let botonenviar = document.createElement("button")      // Creo un boton de enviar el formulario
            botonenviar.textContent = "Enviar"                      // Le pongo texto al boton
            botonenviar.onclick = function(){                       // Cuando sobre el boton de enviar haga click¡      
                let datosenviar = {}                                // Creo un contenedor vacio
                console.log(camposenviar)
                camposenviar.forEach(function(elemento){            // Para cada uno de los campos
                    datosenviar[elemento.getAttribute("placeholder")] = elemento.value  // Añado el contenido del campo al contenedor
                })
                fetch("../servidor/?o=insertar&tabla="+globaltabla, {     // lLamo a crear un nuevo registro
                  method: 'POST', 
                  headers: {
                    'Content-Type': 'application/json', 
                  },
                  body: JSON.stringify(datosenviar)
                })                                                  // Al fetch le envio los datos que quiero insertar
                .then(function(response){
                    return response.json()                          // Ahora mismo no hace nada
                })
                .then(function(datos){
                    console.log(datos)                              // Lanzo los datos por pantalla para debug (quitar)
                    document.getElementById("contienemodal").style.display = "none" // Escondo la ventana modal
                    setTimeout(function(){                          // Despues de un segundo para darle tiempo a PHP
                        cargaTabla(tabla)                           // Cargo de nuevo la tabla para ver modificaciones
                    },1000)
                    
                })
            }
            modal.appendChild(botonenviar)                          // al modal le añado el boton de enviar al final
            var identificador;                                      // Creo una variable id para cada fila
            let contenedordatos = document.querySelector("table tbody") // Selecciono ahora el CUERPO de la tabla
            datos.forEach(function(registro){                       // Para cada uno de los dato del json de entrada
                let fila = document.createElement("tr")             // Creo una nueva fila
                claves.forEach(function(clave){                     // Dentro de la fila, para cada una de las columnas
                    if(clave == "Identificador"){identificador = registro[clave]}
                    let nuevacelda = document.createElement("td")   // Creo un nuevo elemento td
                    nuevacelda.setAttribute("tabla",globaltabla)    // A cada celda le añado un atributo nuevo llamado tabla
                    nuevacelda.setAttribute("identificador",identificador) // A cada celda le añado un atributo nuevo llamado identificador
                    nuevacelda.setAttribute("columna",clave)        // A cada celda le añado un atributo nuevo llamado columna
                    nuevacelda.textContent = registro[clave]        // Le pongo el texto que corresponde a esa columna
                    nuevacelda.ondblclick = function(){             // Cuando haga doble click en cada una de las celdas
                        this.setAttribute("contenteditable","true") // _Hago que se pueda editar esa celda concreta
                        this.focus()                                // Me aseguro de que el foco entre en esa celda
                    }
                    nuevacelda.onblur = function(){                 // Cuando me salga de la celda
                        this.setAttribute("contenteditable","false")    // Le quito la propiedad de que sea editable
                        let valor = this.textContent                // Atrapo su valor
                        let mensaje = {}                            // Creo un json vacio
                        mensaje.tabla = this.getAttribute("tabla")  // Al json le añado el atributo tabla
                        mensaje.identificador = this.getAttribute("identificador")  // Al json le añado el atributo identificador 
                        mensaje.columna = this.getAttribute("columna")  // Al json le añado el atributo columna
                        mensaje.valor = valor;                      // Al json le añado el atributo valor
                        console.log(mensaje)
                        fetch("../servidor/?o=actualizar&tabla="+globaltabla, {     // lLamo a crear un nuevo registro
                          method: 'POST', 
                          headers: {
                            'Content-Type': 'application/json', 
                          },
                          body: JSON.stringify(mensaje)
                        })
                        .then(function(response){
                            return response.text()                          // Ahora mismo no hace nada
                        })
                        .then(function(datos){
                            console.log(datos)
                        })
                    }
                    fila.appendChild(nuevacelda)                    // Añado la columna a la fila
                })
                ///////////////////////////////// CELDA DE OPERACIONES /////////////////////////////////
                let celdaoperaciones = document.createElement("td") // Creo una celda en cada fila
                celdaoperaciones.setAttribute("identificador",identificador)    // Le pongo id clave primaria
                celdaoperaciones.textContent = "🗑️"                  // Le pongo un emoji de papelera
                celdaoperaciones.onclick = function(){              // Cuand haga click en la papelera
                    let idlocal = this.getAttribute("identificador")// Atrapo el id
                    fetch("../servidor/?o=eliminar&tabla="+globaltabla+"&id="+idlocal)  // LLamo a un php y le paso el id
                    .then(function(response){
                        return response.json()
                    })
                    .then(function(datos){
                        console.log(datos)
                        setTimeout(function(){                      // Dentro de un segundo
                            cargaTabla(globaltabla)                 // Vuelvo a cargar la tabla para ver actualizaciones
                        },1000)
                    })
                }
                fila.appendChild(celdaoperaciones)                  // Añado la columna de la papelera a la tabla
                
                ///////////////////////////////// CELDA DE APLICACIONES /////////////////////////////////
                let celdaaplicaciones = document.createElement("td") // Creo una celda en cada fila
                celdaaplicaciones.setAttribute("identificador",identificador)    // Le pongo id clave primaria
                celdaaplicaciones.textContent = "⚙️"                  // Le pongo un emoji de papelera
                celdaaplicaciones.onclick = function(){              // Cuand haga click en la papelera
                    document.getElementById("contienemodal").classList.remove("desaparece")   // El contiene modal aparece con animacion
                    document.getElementById("contienemodal").classList.add("aparece")   // El contiene modal aparece con animacion
                    let contienemodal = document.querySelector("#contienemodal")
                    let modal = document.querySelector("#modal")
                    modal.innerHTML = ""
                    contienemodal.style.display = "block";
                    console.log("Vamos a aplicaciones")
                    let marco = document.createElement("iframe")
                    marco.setAttribute("src","aplicaciones/"+globaltabla+"/?identificador="+this.getAttribute("identificador"))
                    modal.appendChild(marco)
                }
                fila.appendChild(celdaaplicaciones)                  // Añado la columna de la papelera a la tabla
                
                contenedordatos.appendChild(fila)                   // Y ahora añado la fila al cuerpo de la tabla
            })
        })
    }
    ///////////////////////////// CONTENIDO DE LA TABLA ////////////////////////////////////
function cargaResultados(tabla,datos){
  
        document.querySelector("#busca").innerHTML = ""
  
    try{
            document.querySelector("#graficas").remove()
        }catch(error){
            console.log("Las graficas ya no existian")
        }
        let columnascompletas = []
        fetch("../servidor/?o=columnas&tabla="+tabla)
        .then(function(response){                                   // Cauando cargue ese json
            return response.json()                                  // Convierto la respuesta a json (espero que lo que venga sea json)
        })
        .then(function(datos){
            columnascompletas = datos
        })
        var globaltabla = tabla                                     // creo una variable global dentro de la funcion
        document.querySelector("table thead tr").innerHTML = ""     // Vacío la cabecera de la tabla
        document.querySelector("table tbody").innerHTML = ""        // Vacío el cuerpo de la tabla
        document.querySelector("section h3").innerHTML = tabla      // Le pongo nombre al titulo de la tabla                          
                                              // Cuando el paso anterior haya sido completado
            console.log(datos)
            ////////////////////////////////////////////////// TABLA Y FORMULARIO //////////////////////////////////////////////////
            
            let primerregistro = datos[0]                           // Cargo el primer registro de los datos
            let claves = Object.keys(primerregistro)                // Me quedo solo con las columnas (las claves)
            let cabecera = document.querySelector("table thead tr") // Selecciono la cabecera de la tabla
            let cabecerabuscador = document.querySelector("table thead #busca") // Selecciono la cabecera de la tabla
            let modal = document.getElementById("modal")            // Selecciono el modal
            modal.innerHTML = ""                                    // Vacío el modal
            let camposenviar = []                                   // Creo un conjunto para ponerle los campos del formulario
            let titulo = document.createElement("h3")               // Creo un elemento de titulo para el formulario de insercion
            titulo.textContent = "Insertar un nuevo registro en: "+globaltabla  // Le pongo contenido en texto para el titulo del formulario de inserción
            modal.appendChild(titulo)                               // Añado el elemento titulo al formulario
            let seccion = document.createElement("div")             // Creo una sección que va a contener a los campos del formulario
            seccion.setAttribute("class","doscolumnas")             // Le pongo la clase doscolumnas que con css tiene estilo
            cabecerasbuscador = []
            claves.forEach(function(clave){                         // Para cada una de las claves
                let nuevacabecera = document.createElement("th")    // Genero un nuevo table heading
                nuevacabecera.textContent = clave                   // el contenido en texto es el nombre de la clave
                cabecera.appendChild(nuevacabecera)                 // Añado un nuevo elemento a la cabecera
                
                let nuevacabecerabuscador = document.createElement("th")    // Genero un nuevo table heading
                cabecerasbuscador.push(document.createElement("input"))
                cabecerasbuscador[cabecerasbuscador.length-1].setAttribute("type","search")
                cabecerasbuscador[cabecerasbuscador.length-1].setAttribute("placeholder",clave)
                nuevacabecerabuscador.appendChild(cabecerasbuscador[cabecerasbuscador.length-1])
                cabecerabuscador.appendChild(nuevacabecerabuscador)                 // Añado un nuevo elemento a la cabecera
                
                let contenedor = document.createElement("div")      // Creo un pequeño contenedor para cada grupo de texto y campo
                contenedor.setAttribute("class","grupoformulario")  // A ese grupo le añado la clase de grupoformulario
                let texto = document.createElement("p")             // Creo un elemento de parrafo
                texto.textContent = "Introduce el contenido para : "+clave  // Le pongo el texto a ese elemento
                contenedor.appendChild(texto)                       // Al contenedor le añado el texto
                if(clave.includes("_")){
                    let seleccionador = document.createElement("select")
                    seleccionador.setAttribute("placeholder",clave)
                    camposenviar.push(seleccionador)
                    contenedor.appendChild(seleccionador)
                    let tabladestino = clave.split("_")[0]
                    fetch("../servidor/?o=tabla&tabla="+tabladestino)                  // Cargo un json con información
                    .then(function(response){                                   // Cauando cargue ese json
                        return response.json()                                  // Convierto la respuesta a json (espero que lo que venga sea json)
                    })
                    .then(function(datos){                                      // Cuando el paso anterior haya sido completado
                        datos.forEach(function(dato){
                            let cadena = ""
                            let valores = Object.values(dato);
                            valores.forEach(function(trozo){
                                cadena+= trozo+" - ";
                            })
                            let opcion = document.createElement("option")
                            opcion.value=dato.Identificador
                            opcion.textContent = cadena
                            seleccionador.appendChild(opcion)
                        })
                        
                    })
                }else{
                    let entrada = document.createElement("input")       // Creo una nueva entrada para el formulario
                    console.log("vamos a comprobar el tipo de este campo:",clave)
                    columnascompletas.forEach(function(columna){
                        if(clave == columna['Field']){
                            console.log("Tu tipo de datos es: ",columna['Type'])
                            if(columna['Type'].includes("varchar")){
                                entrada.setAttribute("type","text")
                            }else if(columna['Type'].includes("date")){
                                entrada.setAttribute("type","date") 
                            }else if(columna['Type'].includes("int")){
                                entrada.setAttribute("type","number") 
                            }else if(columna['Type'].includes("decimal")){
                                entrada.setAttribute("type","number") 
                            }
                            if(extractNumber(columna['Type']) != null){
                                entrada.setAttribute("maxlength",extractNumber(columna['Type']))
                            }
                        }
                    })
                    camposenviar.push(entrada)                          // Añado el campo al conjunto de campos que he creado antes
                    entrada.setAttribute("placeholder",clave)           // Le añado un atributo a ese campo
                    contenedor.appendChild(entrada)                     // Añado el campo al minicontenedor
                }
                
                seccion.appendChild(contenedor)                     // A la seccion le añado el contenedor
                
            })
            modal.appendChild(seccion)                              // Al modal le añado la seccion
            let columnaoperaciones = document.createElement("th")   // En la cabecera creo una columna vacia para operaciones
            cabecera.appendChild(columnaoperaciones)                // Añado la columna a la cabecera
            
            let columnaaplicaciones = document.createElement("th")   // En la cabecera creo una columna vacia para operaciones
            cabecera.appendChild(columnaaplicaciones)                // Añado la columna a la cabecera
            
            let columnabuscar = document.createElement("th")
            cabecerabuscador.appendChild(columnabuscar)
            
            let botonbuscar = document.createElement("button")
            botonbuscar.textContent = "🔎"
            columnabuscar.appendChild(botonbuscar)
            botonbuscar.onclick = function(){
                console.log("vamos a buscar")
                console.log(cabecerasbuscador)
                let mensaje = {}
                cabecerasbuscador.forEach(function(cabecera){
                    if(cabecera.value != ""){
                        mensaje[cabecera.getAttribute("placeholder")] = cabecera.value
                    }
                })
                console.log(mensaje)
                fetch("../servidor/?o=buscarRelajado&tabla="+globaltabla, {     // lLamo a crear un nuevo registro
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
                })
            }
            
            let botonenviar = document.createElement("button")      // Creo un boton de enviar el formulario
            botonenviar.textContent = "Enviar"                      // Le pongo texto al boton
            botonenviar.onclick = function(){                       // Cuando sobre el boton de enviar haga click¡      
                let datosenviar = {}                                // Creo un contenedor vacio
                console.log(camposenviar)
                camposenviar.forEach(function(elemento){            // Para cada uno de los campos
                    datosenviar[elemento.getAttribute("placeholder")] = elemento.value  // Añado el contenido del campo al contenedor
                })
                fetch("../servidor/?o=insertar&tabla="+globaltabla, {     // lLamo a crear un nuevo registro
                  method: 'POST', 
                  headers: {
                    'Content-Type': 'application/json', 
                  },
                  body: JSON.stringify(datosenviar)
                })                                                  // Al fetch le envio los datos que quiero insertar
                .then(function(response){
                    return response.text()                          // Ahora mismo no hace nada
                })
                .then(function(datos){
                    console.log(datos)                              // Lanzo los datos por pantalla para debug (quitar)
                    document.getElementById("contienemodal").style.display = "none" // Escondo la ventana modal
                    setTimeout(function(){                          // Despues de un segundo para darle tiempo a PHP
                        cargaTabla(tabla)                           // Cargo de nuevo la tabla para ver modificaciones
                    },1000)
                    
                })
            }
            modal.appendChild(botonenviar)                          // al modal le añado el boton de enviar al final
            var identificador;                                      // Creo una variable id para cada fila
            let contenedordatos = document.querySelector("table tbody") // Selecciono ahora el CUERPO de la tabla
            
            datos.forEach(function(registro){                       // Para cada uno de los dato del json de entrada
                let fila = document.createElement("tr")             // Creo una nueva fila
                claves.forEach(function(clave){                     // Dentro de la fila, para cada una de las columnas
                    if(clave == "Identificador"){identificador = registro[clave]}
                    let nuevacelda = document.createElement("td")   // Creo un nuevo elemento td
                    nuevacelda.setAttribute("tabla",globaltabla)    // A cada celda le añado un atributo nuevo llamado tabla
                    nuevacelda.setAttribute("identificador",identificador) // A cada celda le añado un atributo nuevo llamado identificador
                    nuevacelda.setAttribute("columna",clave)        // A cada celda le añado un atributo nuevo llamado columna
                    nuevacelda.textContent = registro[clave]        // Le pongo el texto que corresponde a esa columna
                    nuevacelda.ondblclick = function(){             // Cuando haga doble click en cada una de las celdas
                        this.setAttribute("contenteditable","true") // _Hago que se pueda editar esa celda concreta
                        this.focus()                                // Me aseguro de que el foco entre en esa celda
                    }
                    nuevacelda.onblur = function(){                 // Cuando me salga de la celda
                        this.setAttribute("contenteditable","false")    // Le quito la propiedad de que sea editable
                        let valor = this.textContent                // Atrapo su valor
                        let mensaje = {}                            // Creo un json vacio
                        mensaje.tabla = this.getAttribute("tabla")  // Al json le añado el atributo tabla
                        mensaje.identificador = this.getAttribute("identificador")  // Al json le añado el atributo identificador 
                        mensaje.columna = this.getAttribute("columna")  // Al json le añado el atributo columna
                        mensaje.valor = valor;                      // Al json le añado el atributo valor
                        console.log(mensaje)
                        fetch("../servidor/?o=actualizar&tabla="+globaltabla, {     // lLamo a crear un nuevo registro
                          method: 'POST', 
                          headers: {
                            'Content-Type': 'application/json', 
                          },
                          body: JSON.stringify(mensaje)
                        })
                        .then(function(response){
                            return response.text()                          // Ahora mismo no hace nada
                        })
                        .then(function(datos){
                            console.log(datos)
                        })
                    }
                    fila.appendChild(nuevacelda)                    // Añado la columna a la fila
                })
                ///////////////////////////////// CELDA DE OPERACIONES /////////////////////////////////
                let celdaoperaciones = document.createElement("td") // Creo una celda en cada fila
                celdaoperaciones.setAttribute("identificador",identificador)    // Le pongo id clave primaria
                celdaoperaciones.textContent = "🗑️"                  // Le pongo un emoji de papelera
                celdaoperaciones.onclick = function(){              // Cuand haga click en la papelera
                    let idlocal = this.getAttribute("identificador")// Atrapo el id
                    fetch("../servidor/?o=eliminar&tabla="+globaltabla+"&id="+idlocal)  // LLamo a un php y le paso el id
                    .then(function(response){
                        return response.json()
                    })
                    .then(function(datos){
                        console.log(datos)
                        setTimeout(function(){                      // Dentro de un segundo
                            cargaTabla(globaltabla)                 // Vuelvo a cargar la tabla para ver actualizaciones
                        },1000)
                    })
                }
                fila.appendChild(celdaoperaciones)                  // Añado la columna de la papelera a la tabla
                
                ///////////////////////////////// CELDA DE APLICACIONES /////////////////////////////////
                let celdaaplicaciones = document.createElement("td") // Creo una celda en cada fila
                celdaaplicaciones.setAttribute("identificador",identificador)    // Le pongo id clave primaria
                celdaaplicaciones.textContent = "⚙️"                  // Le pongo un emoji de papelera
                celdaaplicaciones.onclick = function(){              // Cuand haga click en la papelera
                    document.getElementById("contienemodal").classList.remove("desaparece")   // El contiene modal aparece con animacion
                    document.getElementById("contienemodal").classList.add("aparece")   // El contiene modal aparece con animacion
                    let contienemodal = document.querySelector("#contienemodal")
                    let modal = document.querySelector("#modal")
                    modal.innerHTML = ""
                    contienemodal.style.display = "block";
                    console.log("Vamos a aplicaciones")
                    let marco = document.createElement("iframe")
                    marco.setAttribute("src","aplicaciones/"+globaltabla+"/?identificador="+this.getAttribute("identificador"))
                    modal.appendChild(marco)
                }
                fila.appendChild(celdaaplicaciones)                  // Añado la columna de la papelera a la tabla
                
                contenedordatos.appendChild(fila)                   // Y ahora añado la fila al cuerpo de la tabla
            })
            
      
}

function extractNumber(str) {
  const match = str.match(/\d+/);
  return match ? Number(match[0]) : null;
}