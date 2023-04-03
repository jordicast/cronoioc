//import all modules needed for a phone aut


import { } from "https://www.gstatic.com/firebasejs/6.0.2/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";


if (window.localStorage.getItem('id') == null) {
    //redirect to the login.html page if the user is not logged in
    window.location.href = "login.html";
}







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









///////////////////////////////////
//LOGOUT METHODS


let logoutButton = document.getElementById("logout-button");
//logout user
if (logoutButton != null) {
    logoutButton.addEventListener('click', (e) => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("logged Out");
            localStorage.clear();
            window.location.href = "login.html";
        }).catch((error) => {
            console.log("error al desloguejar");
        });
    });

}

//FIN LOGOUT METHODS
//////////////////////////////////////////


//////////////////////////////////////////
//USER PROFILE METHODS

let user_uid = window.localStorage.getItem('id');
//retrieve user data from database to display in the user profile

getCurrentUserData(auth);




//function to get the user email from the firebase database
function getCurrentUserData(auth) {
    let currentUser = new Object();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            //retrieve data from database
            const dbRef = ref(database, 'users/' + user.uid);
            get(dbRef).then((snapshot) => {
                if (snapshot.exists()) {

                    currentUser = {
                        user_uid: user_uid,
                        dateOfCreation: snapshot.val().dateOfCreation.toString(),
                        email: snapshot.val().email.toString(),
                        last_login: snapshot.val().last_login.toString(),
                        oldUserUID: snapshot.val().oldUserUID.toString(),
                        phone: snapshot.val().phone.toString(),
                        userName: snapshot.val().userName.toString(),
                        user_IP: snapshot.val().user_IP.toString()

                    }

                    renderUserData(currentUser);
                    renderUserGames(currentUser);


                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });



        }


    });



}


function renderUserData(currentUser) {
    document.getElementById("userName-container").innerHTML += ` ${currentUser.userName}`
    document.getElementById("userName").innerHTML += ` ${currentUser.userName} no es el Teu nom d'usuari?`
    //document.getElementById("creationDate").innerHTML += ` ${currentUser.dateOfCreation}`
    //document.getElementById("userEmail").innerHTML += ` ${currentUser.email}`
    //document.getElementById("userPhone").innerHTML += ` ${currentUser.phone}`


}



//FIN USER PROFILE METHODS
//////////////////////////////////////////





/////////////////////////////////////////
//HTTP REQUEST METHODS


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


//FIN HTTP REQUEST METHODS
//////////////////////////////////////////

/////////////////////////////////////////
//GAME METHODS

let PlayButton = document.getElementById("game-start");
if (PlayButton != null) {
    PlayButton.addEventListener('click', (e) => {
        window.location.href = "joc.html";
        //...TODO...
        //funció per comprovar si l'usuari te un joc en curs
        //si no te cap joc en curs, crear un nou joc amb checkpoint = -1 i redirigir a la pantalla de joc.
        //si te un joc en curs, carregar el joc, carregar el game status i redirigir a la pantalla de joc.
        console.log("carregaGame")
    });
}





function renderUserGames(user) {
    let ranking = getOwnGames(user);
    
    ranking.sort(function (a, b) {
        let aTime = a.duracion.split(":");
        let bTime = b.duracion.split(":");
        let aSeconds = (+aTime[0]) * 60 * 60 + (+aTime[1]) * 60 + (+aTime[2]);
        let bSeconds = (+bTime[0]) * 60 * 60 + (+bTime[1]) * 60 + (+bTime[2]);
        return aSeconds - bSeconds;
    });
    let gamesContainer = document.getElementById("gamesContainer");

  let userName;
  let duracion;


  let htmlRanking = "";

  //games container innerHTML has a table with userName, duracion 
  htmlRanking +=
    `<table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Posició</th>
          <th scope="col">Usuari</th>
          <th scope="col">Temps</th>
        </tr>
      </thead>
      <tbody>`;


  //renders all ranking entries in the gamesContainer div
  for (let game in ranking) {

    userName = ranking[game].userName;
    duracion = ranking[game].duracion;
    //create an entry on the table with id "rankingTable" adding a th with the userName, duracion 
    htmlRanking += `
      <tr>
        <th scope="row">${parseInt(game) + 1}</th>
        <td>${userName}</td>
        <td>${duracion}</td>
      </tr>`;

  }
  htmlRanking +=
    ` </tbody>
  </table>`

  gamesContainer.innerHTML += htmlRanking;

}


//gets all the games from the database and returns them in an array of objects
function getOwnGames(user) {
    let url = `${firebaseConfig.databaseURL}/games/.json`;
    let response = httpRequest(url);
    let jsonGames = JSON.parse(response);
    let allGames = [];
    //console log all of the attribute gameid of the games in the database
    for (let game in jsonGames) {
        let gameUrl = `${firebaseConfig.databaseURL}/games/${game}/.json`;
        let gameObj = JSON.parse(httpRequest(gameUrl));
        if (gameObj.useruid == user.user_uid || gameObj.useruid == user.oldUserUID) {
            allGames.push(gameObj);
        }


    }
    return (allGames);
};
//FIN GAME METHODS
