//pre carga de imatges
var fondo_presente_off = new Image();
// Establece la fuente de la imagen que quieres pre-cargar
fondo_presente_off = '../img/juego1/fondo_presente_off.jpg';



function cambiarImatge() {
  var imagen = document.querySelector(".maquina");
  var so = document.getElementById("so");
  if (imagen.getAttribute("src") == "../img/juego1/on/maquina_on.png") {
    imagen.setAttribute("src", "../img/juego1/on/maquina_off.png");
  } else {
    imagen.setAttribute("src", "../img/juego1/on/maquina_on.png");
  }
  so.play();
}

function apagarLlum() {
  var maquina = document.querySelector(".maquina"); // Obtener la imagen con la clase "maquina"
  var tablet = document.querySelector(".tablet"); // Obtener la imagen con la clase "tablet"
  var pc = document.querySelector(".pc");
  var photo = document.querySelector(".photo");
  var interruptor = document.querySelector(".interruptor");
  var bgImgContainer = document.getElementById("bgImgContainer"); 

  var so2 = document.getElementById("so-interruptor");

  // Canvia la ruta de "maquina"
  if ((maquina.getAttribute("src") == "../img/juego1/on/maquina_on.png") || (maquina.getAttribute("src") == "../img/juego1/on/maquina_off.png")) {
    maquina.setAttribute("src", "../img/juego1/off/maquina_on.png");
  } else {
    maquina.setAttribute("src", "../img/juego1/on/maquina_on.png");
  }


  // Canvia la ruta de "tablet"
  if (tablet.getAttribute("src") == "../img/juego1/on/tablet.png") {
    tablet.setAttribute("src", "../img/juego1/off/tablet.png");
  } else {
    tablet.setAttribute("src", "../img/juego1/on/tablet.png");
  }

  // Canvia la ruta de  "pc"
  if (pc.getAttribute("src") == "../img/juego1/on/pc.png") {
    pc.setAttribute("src", "../img/juego1/off/pc.png");
  } else {
    pc.setAttribute("src", "../img/juego1/on/pc.png");
  }

  // Canvia la ruta de  "photo"
  if (photo.getAttribute("src") == "../img/juego1/on/polaroid.png") {
    photo.setAttribute("src", "../img/juego1/off/polaroid.png");
  } else {
    photo.setAttribute("src", "../img/juego1/on/polaroid.png");
  }

  // Canvia la ruta de  "interruptor"
  if (interruptor.getAttribute("src") == "../img/juego1/on/interruptor.png") {
    interruptor.setAttribute("src", "../img/juego1/off/interruptor.png");
  } else {
    interruptor.setAttribute("src", "../img/juego1/on/interruptor.png");
  }

  // Canvia la ruta de  "background"
  if (bgImgContainer.style.backgroundImage === 'url("../img/juego1/fondo_presente.jpg")') {
    bgImgContainer.style.backgroundImage = 'url("../img/juego1/fondo_presente_off.jpg")';
  } else {
    bgImgContainer.style.backgroundImage = 'url("../img/juego1/fondo_presente.jpg")';
  }


  so2.play();
}


