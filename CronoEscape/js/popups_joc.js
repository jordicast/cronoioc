//Comprova que s'hagi visualitzat el video i la foto abans de permetre apagar la llum
function comprovaLlum() {
  if (tabletOK == true && photoOK == true) {
    let interruptor = document.querySelector(".interruptor");
    interruptor.setAttribute("id", "llumActivada");
    //Comprova si la llum està apagada o ensesa
    if (
      bgImgContainer.style.backgroundImage ===
      'url("../img/juego1/fondo_presente.jpg")'
    ) {
      //Està apagada
      apagarLlum(false);
      //Està encesa
    } else {
      apagarLlum(true);
    }
  }
}

function cerrarPopUp() {
  document.getElementById("PopUp").style.display = "none";
}
//Tanca el popup de video
function cerrarPopUpVideo() {
  document.getElementById("PopUp").style.display = "none";
  //Serveix per parar el video al tancar el popup
  document.getElementById("video").src = ""; // Para la reproducció del video al tancar el popup
}

//PopUp Tablet
var tabletOK = false;
function PopUpTablet() {
  var div = document.querySelector(".PopUps");
  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5);">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:60px;">
  <button class="btn " onclick="cerrarPopUpVideo()" id="tancar">X</button>
    <iframe id="video" width="560" height="315" src="https://www.youtube.com/embed/wfzecNXhGk8" frameborder="0" allow="accelerometer; autoplay;" allowfullscreen></iframe>
  </div>
</div>`;
  tabletOK = true;
  console.log("Tablet activada");
  div.innerHTML = text;
}

//PopUp Photo
var photoOK = false;
function PopUpPhoto() {
  var div = document.querySelector(".PopUps");
  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: transparent;">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:transparent; padding:10px;">
  <button class="btn btn-primary" onclick="cerrarPopUp()" id="tancar">X</button>
    <img src="../img/juego1/on/polaroid-popup.png">
  </div>
</div>`;
  photoOK = true;
  console.log("Foto activada");
  div.innerHTML = text;
}

//PopUp Ordinador
function PopUpPC() {
  var div = document.querySelector(".PopUps");

  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5);">
  <div style="display:block; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:50px;">
  <button class="btn " onclick="cerrarPopUp()" id="tancar">X</button>
    <img src="../img/juego1/on/pc_popup.png">
    <input id="input_resposta" type="text" style="position:absolute; top: 65%; left: 50% ;background-color:transparent; border:none; font-size: 40px; color: white;
    transform: translate(-50%, -50%);" type="text" placeholder="Introdueix la resposta">
    <button class="btn btn-primary" style="position:absolute; top: 80%; left: 50% ; font-size: 25px;
    transform: translate(-50%, -50%);" onclick="comprovaResposta()">Comprova</button>
  </div>
  </div>`;
  div.innerHTML = text;
}

//Comprova resposta ordinador
function comprovaResposta() {
  var input = document.getElementById("input_resposta");
  if (  input.value.toLowerCase() === "triangulo" || input.value.toLowerCase() === "triangle"
  ) {
    // L'entrada correspon amb 'Triangulo' o 'Triangle'
    console.log("Correcte");
  } else {
    // L'entrada no correspon amb 'Triangulo' o 'Triangle'
    console.log("Incorrecte");
  }
}
