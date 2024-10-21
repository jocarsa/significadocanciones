function grafica(contenedor,datos,color,titulo){
    let colores =  []
    let colorbase = color
    let variacioncolor = 50;
    for(let i = 0;i<100;i++){
        let rojo = Math.abs(colorbase[0] + (Math.random()-0.5)*variacioncolor)
        let verde = Math.abs(colorbase[1] + (Math.random()-0.5)*variacioncolor)
        let azul = Math.abs(colorbase[2] + (Math.random()-0.5)*variacioncolor)
        colores.push("rgb("+rojo+","+verde+","+azul+")")
    }

    let suma = 0;
    Object.keys(datos).forEach(clave => {
      suma += datos[clave]
    });
    console.log(suma);

    let anchura = 512;                                  // Defino una anchura
    let altura = anchura;                               // La altura es igual a la anchura
    let radio = anchura/2-60;                           // Defino el radio un poco menor para tener margen

    const lienzo = document.createElement("canvas");    // Llamo al lienzo
    const contexto = lienzo.getContext("2d");           // Dibujo en 2D

    lienzo.width = anchura;                             // Le pongo la anchura al lienzo
    lienzo.height = altura;                             // Le pongo la altura al lienzo

    //lienzo.style.border = "1px solid grey";             // Le pongo un borde al lienzo para verlo

    let cursor = 0
    let contador = 1;
    Object.keys(datos).forEach(clave => {               // Para cada uno de los elementos del json

        contexto.fillStyle = colores[contador]                          // Voy a pintar de color rojo

        let inicio = cursor                             // El inicio es el angulo en el que empiezo
        let final = cursor + (datos[clave]/suma)*Math.PI*2  // El final es el angulo en el que acabo
        cursor += (datos[clave]/suma)*Math.PI*2             // Actualizo el cursor para que el principio del siguiente angulo sea el final del angulo anterior

        contexto.beginPath();                               // Inicio el trazo
        contexto.moveTo(anchura/2,altura/2);                // Muevo el cursor al centro
        contexto.arc(anchura/2,altura/2,radio,inicio,final); // Trazo el arco

        contexto.fill();                                    // Y relleno
        contador++;

        contexto.textAlign = "center"

        let ax = anchura/2+Math.cos(inicio+((final-inicio)/2))*radio/2
        let ay = altura/2+Math.sin(inicio+((final-inicio)/2))*radio/2
        contexto.fillStyle = "white"
        /*contexto.beginPath();
        contexto.arc(ax,ay,5,0,Math.PI*2)
        contexto.fill()*/

        contexto.font = "15px sans-serif"

        contexto.fillText(clave+":"+datos[clave],ax,ay)

    });
    contexto.font = "25px sans-serif"
    contexto.textAlign = "left"
    contexto.fillStyle = "darkcyan";
    contexto.fillText(titulo,20,20)
    document.getElementById(contenedor).appendChild(lienzo)
}