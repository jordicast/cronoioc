function cambiarImatge() {
  var imagen = document.querySelector(".maquina3");
  var so = document.getElementById("so");

    //Llum encesa
    if (imagen.getAttribute("src") == "../img/juego1/on/maquina_on.png") {
      imagen.setAttribute("src", "../img/juego1/on/maquina_off.png");
      imagen.setAttribute("id", "maquinaOFF");
    } else {
      imagen.setAttribute("src", "../img/juego1/on/maquina_on.png");
      imagen.setAttribute("id", "maquinaON");
    }
 
  so.play();
}



