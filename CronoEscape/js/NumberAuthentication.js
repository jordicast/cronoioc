//import all modules needed for a phone aut
import { } from "https://www.gstatic.com/firebasejs/6.0.2/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAeDL27nl02X1NlY6mNGLQZRWU_VDrdPVE",
    authDomain: "phoneauth-24dcb.firebaseapp.com",
    databaseURL: "https://phoneauth-24dcb-default-rtdb.firebaseio.com",
    projectId: "phoneauth-24dcb",
    messagingSenderId: "738485527632",
    appId: "1:738485527632:web:df9073639414f0e6d99d55"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

window.onload = function () {
    render();
    let sendCodeButton = document.getElementById('sendCode');
    let verifyCodeButton = document.getElementById('verifyCode');
    sendCodeButton.addEventListener('click', sendCode);
    verifyCodeButton.addEventListener('click', verifyCode);
};

function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render();
}


function sendCode() {
    globalThis.number = document.getElementById('number').value;
    globalThis.email = "email@value1.com;"
    globalThis.userIP = getUserIP();
    phoneAuth();
}

function verifyCode() {
    codeverify();
}





function phoneAuth() {
    //get the number
    let number = globalThis.number;
    //phone number authentication function of firebase
    //it takes two parameter first one is number,,,second one is recaptcha
    firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier)
        .then(function (confirmationResult) {
            //s is in lowercase
            window.confirmationResult = confirmationResult;
            window.coderesult = confirmationResult; // assign confirmationResult to coderesult variable
            alert("Message sent");
        }).catch(function (error) {
            alert(error.message);
        });
}

function codeverify() {
    var code = document.getElementById('verificationCode').value;

    window.coderesult.confirm(code).then(function () {
        
        
        alert("Successfully registered");

        let number = globalThis.number;
        let email = "email@value2.com";
        let userIP = getUserIP();
        let password = "password";
        let userName = "username";
        let playedGames = 0;
        let currentGameUID = null;

        //createUserwithemailandpasword pushing the previous data to the database 
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                // ... user.uid
                set(ref(database, 'users/' + user.uid), {
                    email: email,
                    registered_ip: getUserIP(),
                    phone: number,
                    playedGames: playedGames,
                    userName: userName,
                    currentGameUID: currentGameUID
                })
                    .then(() => {
                        // Data saved successfully!
                        login(email, password);
                        console.log(userName + 'user created successfully');
                    })
                    .catch((error) => {
                        // The write failed...
                        //capture the div class login-container and append the error message in red
                        console.log(error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                alert(errorMessage);
            });
    }).catch(function (error) {
        alert(error.message);
    });
}


//function to return the current user IP from api ipify using httpRequest
function getUserIP() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://api.ipify.org?format=json', false);
    httpRequest.send();
    if (httpRequest.status === 200) {
        return JSON.parse(httpRequest.responseText).ip;
    }
}