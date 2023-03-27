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

//create user object to store the data to be pushed to the database
let user = {
    email: "",
    userIP: "",
    number: "",
    userName: "",
    password: "",

    oldUserUID: null,
    playedGames: 0,
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

}


//render the captcha onload
function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render();
}


function sendCode() {

    //when sendcode is clicked then we set up the user info
    user.email = document.getElementById('email').value;
    user.userIP = getUserIP();
    user.number = document.getElementById('number').value;
    user.userName = document.getElementById('userName').value;
    user.password = document.getElementById('password').value;
    let repeatPassword = document.getElementById('repeatPassword').value;
    //check if the password is the same
    if (user.password != repeatPassword) {
        alert("Password not the same");
        return;
    }
    //phone needs to start by +34 and have 11 numbers in total.
    if (phoneNotValid(user.number)) {
        alert(user.number + ", this phone number not valid, needs to start with 34 and have 11 numbers in total");
        return;
    }

    //email needs to have @ and .com or .es or .org or .net
    if (emailNotValid(user.email)) {
        alert("Email not valid, needs to look like this: email@dominio.xxx");
        return;
    };
    //check if the phone or email already exists in the database
    if (phoneExists(user.number) || emailExists(user.email)) {
        alert("Phone number or email not available");
        return;
    };


    //if ip exists then we search the old user uid and we set it to the user object
    if (IPexists(user.userIP)) {
        user.oldUserUID = getOldUserUID(user.userIP);
    };

    phoneAuth(user.number);

}

function verifyCode() {
    let code = document.getElementById('verificationCode').value;
    codeverify(code);
}



function phoneAuth(number) {
    //phone number authentication function of firebase
    //it takes two parameter first one is number,second one is recaptcha
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

function codeverify(code) {
    //code verification function of firebase
    window.coderesult.confirm(code).then(function () {
        // User signed in successfully.
        alert("Successfully registered");

        let number = user.number;
        let email = user.email;
        let userIP = user.userIP;
        let password = user.password;
        let userName = user.userName;
        let oldUserUID = getOldUserUID(userIP);


        //createUserwithemailandpasword pushing the previous data to the database 
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                // ... user.uid
                set(ref(database, 'users/' + user.uid), {
                    email: email,
                    user_IP: userIP,
                    phone: number,
                    userName: userName,
                    oldUserUID: oldUserUID,
                })
                set(ref(database, 'phone/' + number), {
                    user_uid: user.uid,
                })
                set(ref(database, 'email/' + email), {
                    user_uid: user.uid,
                })
                set(ref(database, 'userIP/' + userIP), {
                    user_uid: user.uid,
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



//function to check if the phone number already exists in the database
function phoneExists(phone) {

    let phoneExists = false;
    let phoneRef = ref(database, 'phone/' + phone);
    phoneRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data != null) {
            phoneExists = true;
        }
    });
    return phoneExists;

}

//function to check if the email already exists in the database
function emailExists(email) {

    let emailExists = false;
    let emailRef = ref(database, 'email/' + email);
    emailRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data != null) {
            emailExists = true;
        }
    });
    return emailExists;

}


//function to get the old user UID from the database by the IP
function getOldUserUID(IP) {

    let oldUserUID = null;
    const IPRef = ref(database, 'userIP/' + IP);
    IPRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data != null) {
            oldUserUID = data.user_uid;
        }
    });
    return oldUserUID;

}

//function to check if the phone number is valid
function phoneNotValid(phone) {
    if (phone.length != 11) {
        return true;
    }
    if (phone.substring(0, 2) != "+34") {
        return true;
    }
    return false;
}

//function to check if the email is valid
function emailNotValid(email){
    if (email.includes("@") && email.includes(".")) {
        return false;
    }
    return true;
}
