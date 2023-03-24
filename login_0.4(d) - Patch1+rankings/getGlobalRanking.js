//import all modules needed 
import { } from "https://www.gstatic.com/firebasejs/6.0.2/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDp_QjlZP6cah2JBQLIXKSbfKtOIUfZ4Tw",
  authDomain: "cronoescape-ioc.firebaseapp.com",
  databaseURL: "https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cronoescape-ioc",
  storageBucket: "cronoescape-ioc.appspot.com",
  messagingSenderId: "240259839325",
  appId: "1:240259839325:web:20ef18366fd73d2aa2a4b4",
  measurementId: "G-QQD81WK4CE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);


//gets all the games from the database and returns them in an array of objects
function getAllGames() {
  let url = `${firebaseConfig.databaseURL}/games/.json`;
  let response = httpRequest(url);
  let jsonGames = JSON.parse(response);
  let allGames = [];
  //console log all of the attribute gameid of the games in the database
  for (let game in jsonGames) {
    let gameUrl = `${firebaseConfig.databaseURL}/games/${game}/.json`;
    let gameObj = JSON.parse(httpRequest(gameUrl));
    allGames.push(gameObj);
  }
  return allGames;
};




function getGlobalRanking() {
  let ranking = [];
  let allGames = getAllGames();
  for (let game in allGames) {//ONLY FOR THE FIRST ID=1 GAME AND FINISHED GAMES (CHECKPOINT=999)
    if (allGames[game].gameid === 1 && allGames[game].checkpoint === 999) {
      ranking.push(allGames[game]);
    };
  }


  //order the ranking by the duracion attibute, the atribute format is "hh:mm:ss"
  ranking.sort(function (a, b) {
    let aTime = a.duracion.split(":");
    let bTime = b.duracion.split(":");
    let aSeconds = (+aTime[0]) * 60 * 60 + (+aTime[1]) * 60 + (+aTime[2]);
    let bSeconds = (+bTime[0]) * 60 * 60 + (+bTime[1]) * 60 + (+bTime[2]);
    return aSeconds - bSeconds;
  });

  return ranking;
}

function renderRanking(ranking) {
  let gamesContainer = document.getElementById("gamesContainer");
  let userName;
  let duracion;
  let fechaFin;
  //games container innerHTML has a table with userName, duracion and fecha fin
  gamesContainer.innerHTML =
    `<table id="rankingTable">
      <tr id="valoresRanking">
        <th>userName</th>
        <th>duracion</th>
        <th>fechaFin</th>
        <th>medalla</th>
      </tr>
    </table>`;
  let rankingTable = document.getElementById("rankingTable");
  //renders all ranking entries in the gamesContainer div
  for (let game in ranking) {
    userName = ranking[game].userName;
    duracion = ranking[game].duracion;
    fechaFin = ranking[game].fechaFin;
    //create an entry on the table with id "rankingTable" adding a th with the userName, duracion and fechaFin
    rankingTable.innerHTML += `
      <tr>
        <th>${userName}</th>
        <th>${fechaFin}</th>
        <th>${duracion}</th>
        <th>Fusta<th>
      </tr>`;

  }

}

renderRanking(getGlobalRanking());














//function to make an http request to the URL and return the response
function httpRequest(url) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', url, false);
  httpRequest.send();
  if (httpRequest.status === 200) {
    return httpRequest.responseText;
  } else {
    return null;
  }
}

//function to check if the data exists in the database
function dataExists(url) {
  let data = httpRequest(url);
  if (data != "null") {
    return true;
  } else {
    return false;
  }
}

