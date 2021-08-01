'use strict';

const version = "1.0.0-beta";

let userLang = localStorage.getItem("userLang");
if (userLang == null) {
  userLang = 0;
};

const lang = ["English", "Français"];
const currentPage = ["admin", "intro", "open", "auth", "retrieve", "doorNew", "doorExisting"];

const locUpdateTime = 1000; // update of location (in the server)


// In case of problem, re-start the local storage
/*
localStorage.setItem("page", "");
localStorage.setItem("userId", "");
localStorage.setItem("userEmail", "");
localStorage.setItem("userData", "");
localStorage.setItem("database", "");
*/

let page = localStorage.getItem("page");
let userId = localStorage.getItem("userId");
let userEmail = localStorage.getItem("userEmail");
let userData = localStorage.getItem("userData");
let database = localStorage.getItem("database");
let photo;

let checkOpen = true; // check to open an account

let checkOpenDoorAdult = true;



function makeId(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

/* I am new */

function openAccount() {
  languageChoice();
  switch (parseInt(userLang)) {
    case 0:
      document.getElementById('webcontent').innerHTML = "<h2>Open a new account</h2>";
      document.getElementById('webcontent').innerHTML += "<p><input type='checkbox' id='myCheck' onclick='insertButton();'> I accept the <a href='PrivacyPolicy.html'>Privacy Policy</a> and the <a href='TermsandConditions.html'>Terms and Conditions</a>.</p>";
      document.getElementById('webcontent').innerHTML += "<Br></Br>";
      document.getElementById('webcontent').innerHTML += "<div id='confirmButtonId'></div>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML += "<h2>Ouvrir un nouveau compte</h2>";
      document.getElementById('webcontent').innerHTML += "<p><input type='checkbox' id='myCheck' onclick='insertButton();'> J'accepte la <a href='PrivacyPolicyfr.html'>Politique de Confidentialité</a> et les <a href='TermsandConditionsfr.html'>Termes et Conditions</a>.</p>";
      document.getElementById('webcontent').innerHTML += "<Br></Br>";
      document.getElementById('webcontent').innerHTML += "<div id='confirmButtonId'></div>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}


function mainOpen() {
  const newUser = {
    identifier: "",
    email: document.getElementById('emailId').value,
    language: userLang,
    recovery: Date.now(),
    minor: undefined,
    web: "",
    selfie: "",//selfie
    hostility: [],
    verified: false,
    TId: "" //temporal identifier
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  };
  fetch('/newaccount', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h2>To ensure that this email is yours, Caballero Software Inc. will send you an email with your identifier.</h2>";
          document.getElementById('webcontent').innerHTML += "<h3>This email will be sent from: caballerosoftwareinc at gmail dot com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h2>Pour s'assurer que cet e-mail est le vôtre, Caballero Software Inc. vous enverra un courrier électronique avec votre identifiant.</h2>";
          document.getElementById('webcontent').innerHTML += "<h3>Cet courrier électronique sera envoyé par : caballerosoftwareinc at gmail dot com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    } else {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h2>There is already a user with this email.</h2>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h2>Il y a déjà un utilisateur avec cet email.</h2>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    }
  })
}


function insertButton() {
  if (checkOpen) {
    switch (parseInt(userLang)) {
      case 0:
        document.getElementById("confirmButtonId").innerHTML = "<h2>Email</h2>";
        document.getElementById("confirmButtonId").innerHTML += "<p><input type='text' id='emailId'></p>";
        document.getElementById("confirmButtonId").innerHTML += "<br><button onclick='mainOpen();'>Register</button><Br></Br>";
        break;
      case 1:
        document.getElementById("confirmButtonId").innerHTML = "<h2>Courrier Électronique</h2>";
        document.getElementById("confirmButtonId").innerHTML += "<p><input type='text' id='emailId'></p>";
        document.getElementById("confirmButtonId").innerHTML += "<br><button onclick='mainOpen();'>Enregistre-moi</button><Br></Br>";
        break;
      default:
        document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
        break;
    };
    checkOpen = false;
  } else {
    document.getElementById("confirmButtonId").innerHTML = "";
    checkOpen = true;
  }
}

/* I have an account */
function goToPage(i) {
  localStorage.setItem('page', currentPage[i]);
  location.reload();
}




function uploadDatabase(file) {
  const reader = new FileReader();
  reader.onload = function (evt) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file: evt.target.result })
    };
    fetch('/apiupdatedata', options);
  };
  reader.readAsText(file.files[0]);
}

function adminMenu() {
  // admin only in English (for simplicity)
  document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
  document.getElementById('subtitleId').innerHTML = "<p class='w3-large'>Administrator at Caballero Software Inc.</p>";
  document.getElementById('authcontent').innerHTML = "<h2>Main Menu</h2>";
  document.getElementById('authcontent').innerHTML += "<br><br><p>Download database.</p>";
  document.getElementById('authcontent').innerHTML += "<button onclick='downloadDatabase();'>Download</button><br><br>";
  document.getElementById('authcontent').innerHTML += '<input id="json-file" type="file" onchange="uploadDatabase(this)"><br><br>';
  document.getElementById('authcontent').innerHTML += "<br><br><p>Logout this service.</p>";
  document.getElementById('authcontent').innerHTML += "<button onclick='logoutAdmin();'>Logout</button>";
}

function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function downloadDatabase() {
  const data = JSON.parse(database);
  let print = "";
  for (let x of data) {
    x["_id"] = makeId(16);
    print += JSON.stringify(x) + "\n"
  }
  download('database.txt', print);
}

function authentication() {
  userEmail = document.getElementById('emailId').value;
  userId = document.getElementById('identifierId').value;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, email: userEmail })
  };
  fetch('/apiauthentication', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", userEmail);
      if (userEmail == "caballero@caballero.software") {
        database = respo.database;
        localStorage.setItem("database", JSON.stringify(database));
        localStorage.setItem("page", "admin");
        location.reload();
      } else {
        userData = respo.userData;
        localStorage.setItem("userData", JSON.stringify(userData));
        goToPage(5);
      }
    } else {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('webcontent').innerHTML += "<p>Authentication error. Try again.</p>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML += "<p>Erreur d'authentification. Réessayer.</p>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    };
  })
}

function existingUser() {
  languageChoice();
  switch (parseInt(userLang)) {
    case 0:
      document.getElementById('webcontent').innerHTML += "<h3>Email</h3><br>";
      document.getElementById('webcontent').innerHTML += '<p><input type="text" id="emailId"></p>';
      document.getElementById('webcontent').innerHTML += "<h3>Identifier</h3><br>";
      document.getElementById('webcontent').innerHTML += "<input type='text' id='identifierId'><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='authentication()'>Login</button><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(4);'>I forgot my Identifier</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML += "<h3>Courrier Électronique</h3><br>";
      document.getElementById('webcontent').innerHTML += '<p><input type="text" id="emailId"></p>';
      document.getElementById('webcontent').innerHTML += "<h3>Identifier</h3><br>";
      document.getElementById('webcontent').innerHTML += "<input type='text' id='identifierId'><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='authentication()'>Connexion</button><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(4);'>J'ai oublié mon identifiant</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function forgotIdentifier() {
  languageChoice();
  switch (parseInt(userLang)) {
    case 0:
      document.getElementById('webcontent').innerHTML += "<h4>To retrieve your identifier, enter your email</h4>";
      document.getElementById('webcontent').innerHTML += "<h3>Email</h3><br>";
      document.getElementById('webcontent').innerHTML += '<input type="text" id="emailId">';
      document.getElementById('webcontent').innerHTML += "<h4>and click the next button</h4><br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='retrieveIdentifier()'>Send me my identifier</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1)'>Home</button>";
      document.getElementById('webcontent').innerHTML += "<Br></Br><p>To request identifier retrieval, you must wait at least 24 hours from the last email retrieval or account opening.</p><br>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML += "<h4>Pour récupérer votre identifiant, entrez votre courrier électronique</h4>";
      document.getElementById('webcontent').innerHTML += "<h3>Courrier Électronique</h3><br>";
      document.getElementById('webcontent').innerHTML += '<input type="text" id="emailId">';
      document.getElementById('webcontent').innerHTML += "<h4>et cliquez sur le bouton suivant</h4><br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='retrieveIdentifier()'>Envoyez-moi mon identifiant</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1)'>Accueil</button>";
      document.getElementById('webcontent').innerHTML += "<Br></Br><p>Pour demander la récupération d'identifiant, vous devez attendre au moins 24 heures à compter de la dernière récupération d'email ou ouverture de compte.</p><br>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function retrieveIdentifier() {
  userEmail = document.getElementById('emailId').value;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: userEmail })
  };
  fetch('/apiretrieveidentifier', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h3>An email containing your identifier was sent to you from: caballerosoftwareinc at gmail dot com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h3>Un courrier électronique contenant votre identifiant vous a été envoyé depuis: caballerosoftwareinc à gmail point com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };

    } else {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h3>It was not possible to request the recovery of the identifier.</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h3>Il n'a pas été possible de demander la récupération de l'identifiant.</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    }
  })
}


function logoutUser() {
  localStorage.setItem("userId", "");
  localStorage.setItem("userEmail", "");
  localStorage.setItem("userData", "");
  localStorage.setItem("page", "");
  location.reload();
}

function logoutAdmin() {
  localStorage.setItem("userId", "");
  localStorage.setItem("userEmail", "");
  localStorage.setItem("database", "");
  localStorage.setItem("page", "");
  location.reload();
}

function deleteUser() {
  switch (parseInt(userLang)) {
    case 0:
      if (confirm("Are you sure you want to delete your account?")) {

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, userEmail })
        };

        fetch('/apidelete', options).then(async response => {
          let respo = await response.json();
          localStorage.setItem("userId", "");
          localStorage.setItem("userEmail", "");
          localStorage.setItem("userLang", 0);
          confirm("Your account has been deleted");
          localStorage.setItem("page", "");
          location.reload();
        });
      } else {
        alert("Your account is fine.");
      }
      break;
    case 1:
      if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, userEmail })
        };

        fetch('/apidelete', options).then(async response => {
          let respo = await response.json();
          localStorage.setItem("userId", "");
          localStorage.setItem("userEmail", "");
          localStorage.setItem("userLang", 0);
          confirm("Votre compte a été supprimé");
          location.reload();
        });
      } else {
        alert("Votre compte va bien.");
      }
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
};



function introMenu() {
  languageChoice();
  switch (parseInt(userLang)) {
    case 0:
      document.getElementById('titlePageId').innerHTML = "Caballero|Door";
      document.getElementById('allId').lang = 'en';
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">Welcome to Caballero|Door</h1>';
      document.getElementById('subtitleId').innerHTML = '<p class="w3-large">A hate crime prevention service provided by Caballero Software Inc.</p>';
      document.getElementById('subtitleId').innerHTML += '<p class="w3-large">version: ' + version + '</p>';
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(2)'>Open account</button>";
      document.getElementById('webcontent').innerHTML += '<br><br><button onclick="goToPage(3);">I have an account</button><br><br>';
      document.getElementById('footerId').innerHTML = "<h1>Contact</h1>";
      document.getElementById('footerId').innerHTML += "<h4>Caballero Software Inc.</h4>";
      document.getElementById('footerId').innerHTML += '<p style="white-space: pre-line">Address: 201 Lester St, Unit 303, Waterloo, ON Canada N2L 3W3 <br>';
      document.getElementById('footerId').innerHTML += 'Email: caballero@caballero.software <br><br>';
      document.getElementById('footerId').innerHTML += 'Phone: +1 (438) 993-2054 <br><br>';
      document.getElementById('footerId').innerHTML += 'Website: <a href="https://caballero.software/">https://caballero.software/</a></p>';
      document.getElementById('footerId').innerHTML += "<br><img src='logo3.png' style='width:30%'></img>";
      break;
    case 1:
      document.getElementById('titlePageId').innerHTML = "Caballero|Porte";
      document.getElementById('allId').lang = 'fr';
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">Bienvenue chez Caballero|Porte</h1>';
      document.getElementById('subtitleId').innerHTML = "<p class='w3-large'>Un service de prévention des crimes haineux fourni par Caballero Software Inc.</p>";
      document.getElementById('subtitleId').innerHTML += '<p class="w3-large">version: ' + version + '</p>';
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(2)'>Ouvrir un compte</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(3)'>J'ai un compte</button><br><br>";
      document.getElementById('footerId').innerHTML = "<h1>Nous joindre</h1>";
      document.getElementById('footerId').innerHTML += "<h4>Caballero Software Inc.</h4>";
      document.getElementById('footerId').innerHTML += '<p style="white-space: pre-line">Adresse: 201 Lester St, Unit 303, Waterloo, ON Canada N2L 3W3 <br>';
      document.getElementById('footerId').innerHTML += 'Courrier Électronique: caballero@caballero.software <br><br>';
      document.getElementById('footerId').innerHTML += 'Téléphone: +1 (438) 993-2054 <br><br>';
      document.getElementById('footerId').innerHTML += 'Site Internet: <a href="https://caballero.software/">https://caballero.software/indexfr.html</a></p>';
      document.getElementById('footerId').innerHTML += "<br><img src='logo3.png' style='width:30%'></img>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function changeLang(i) {
  userLang = i;
  localStorage.setItem("userLang", userLang);
  location.reload();
}

function languageChoice() {
  document.getElementById('langId').innerHTML = '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
  if (0 == userLang) {
    document.getElementById('langId').innerHTML += '<button style = "background-color: #04AA6D" onclick="changeLang(' + 0 + ')">' + lang[0] + '</button>';
  } else {
    document.getElementById('langId').innerHTML += '<button style = "background-color: #C0C0C0" onclick="changeLang(' + 0 + ')">' + lang[0] + '</button>';
  };
  for (let i = 1; i < lang.length; i++) {
    if (i == userLang) {
      document.getElementById('langId').innerHTML += '<br><br><button style = "background-color: #04AA6D" onclick="changeLang(' + i + ')">' + lang[i] + '</button>';
    } else {
      document.getElementById('langId').innerHTML += '<br><br><button style = "background-color: #C0C0C0" onclick="changeLang(' + i + ')">' + lang[i] + '</button>';
    };
  };
  document.getElementById('langId').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';

}


// Caballero|Door

function registerDoor() {
  let jsonBody;
  if (checkOpenDoorAdult) {    
    jsonBody = { userId, userEmail, minor : true };
  } else {
    jsonBody = { userId, userEmail, minor : false,  web : document.getElementById('inputWebsiteDoor').value, selfie: photo };
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonBody)
  };

  fetch('/apiauthenticationservice', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      photo = '';
      goToPage(6);
    } else {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('webcontent').innerHTML += "<p>Authentication error. Try again.</p>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML += "<p>Erreur d'authentification. Réessayer.</p>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    };
  });
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

async function SavePhoto(inp) {
  // upload a selfie
  // I am not using p5, because of the license is not convenient for this project.
  photo = await toBase64(inp.files[0]);
}

function insertPictureDoor() {
  if (checkOpenDoorAdult) {
    switch (parseInt(userLang)) {
      case 0:
        document.getElementById('websiteDoor').innerHTML = "<p>Link to a website where your email and image appear. The more institutional, the better.</p>";
        document.getElementById('websiteDoor').innerHTML += '<input type="text" id = "inputWebsiteDoor"> <br><br>';
        document.getElementById('pictureDoor').innerHTML = "<p>Would you please upload a selfie of your face so that it can be easily identified?</p>";
        document.getElementById('pictureDoor').innerHTML += '<input id="image-file" type="file" onchange="SavePhoto(this)"><br><br>';
        break;
      case 1:
        document.getElementById('websiteDoor').innerHTML = "<p>Lien vers un site Web où votre e-mail et votre image apparaissent. Plus c'est institutionnel, mieux c'est.</p>";
        document.getElementById('websiteDoor').innerHTML += '<input type="text" id = "inputWebsiteDoor"> <br><br>';
        document.getElementById('pictureDoor').innerHTML = "<p>Pourriez-vous s'il vous plaît prendre un selfie de votre visage afin qu'il puisse être facilement identifié ?</p>";
        document.getElementById('pictureDoor').innerHTML += '<input id="image-file" type="file" onchange="SavePhoto(this)"><br><br>';
        break;
      default:
        document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
        break;
    };
    checkOpenDoorAdult = false;
  } else {
    document.getElementById('websiteDoor').innerHTML = "";
    document.getElementById('pictureDoor').innerHTML = "";
    checkOpenDoorAdult = true;
  }
}


function doorMenuNew() {
  languageChoice();
  switch (parseInt(userLang)) {
    case 0:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('titleId').innerHTML += "<h2>Personal information</h2>";
      document.getElementById('authcontent').innerHTML += "<Br></Br>";
      
      document.getElementById('authcontent').innerHTML += "<p><input type='checkbox' id='myCheck2' onclick='insertPictureDoor();'> I am an adult according to the legislation of my country.</p>";

      document.getElementById('authcontent').innerHTML += "<div id='checkboxDoorAdult'></div>";
      document.getElementById('authcontent').innerHTML += "<div id='websiteDoor'></div>";
      document.getElementById('authcontent').innerHTML += "<div id='pictureDoor'></div>";
      document.getElementById('authcontent').innerHTML += "<div id='confirmButtonIdDoor'></div>";

      document.getElementById("authcontent").innerHTML += "<br><button onclick='registerDoor();'>Next</button><Br></Br>";
      break;
    case 1:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('titleId').innerHTML += "<h2>Renseignements personnels</h2>";
      document.getElementById('authcontent').innerHTML += "<Br></Br>";
      
      document.getElementById('authcontent').innerHTML += "<p><input type='checkbox' id='myCheck2' onclick='insertPictureDoor();'> Je suis majeur selon la législation de mon pays.</p>";

      document.getElementById('authcontent').innerHTML += "<div id='checkboxDoorAdult'></div>";
      document.getElementById('authcontent').innerHTML += "<div id='websiteDoor'></div>";
      document.getElementById('authcontent').innerHTML += "<div id='pictureDoor'></div>";
      document.getElementById('authcontent').innerHTML += "<div id='confirmButtonIdDoor'></div>";

      document.getElementById("authcontent").innerHTML += "<br><button onclick='registerDoor();'>Suivant</button><Br></Br>";
      
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function updateIdDoor() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, userEmail })
  };

  fetch('/apitiddoor', options).then(async response => {
    let respo = await response.json();
    let myTId = respo.myTId;
    switch (parseInt(userLang)) {
      case 0:
        document.getElementById('myIdDoor').innerHTML = "My temporary identifier: " + myTId;
        break;
      case 1:
        document.getElementById('myIdDoor').innerHTML = "Mon identifiant temporaire : " + myTId;
        break;
      default:
        document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
        break;
    };
  });
}

function otherIdDoorGetData() {
  let otherTId = document.getElementById('otherIdDoor').value;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ otherTId })
  };


  fetch('apitiddoordata', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('otherIdDoorData').innerHTML = "<p>Is this the person in front of you?</p>";
          document.getElementById('otherIdDoorData').innerHTML += "<br><img src='" + respo.picture + "' alt='person' width='200' height='185' />";
          document.getElementById('otherIdDoorData').innerHTML += "<p>Hostility: </p>";

          if (respo.verified) {
            for (let b of respo.hostility) {
              document.getElementById('otherIdDoorData').innerHTML += "<p>-" + b + "</p>";
            }
          } else {
            document.getElementById('otherIdDoorData').innerHTML += "<p>Not yet verified.</p>";
          }
          break;
        case 1:
          document.getElementById('otherIdDoorData').innerHTML = "<p>Est-ce la personne en face de vous ?</p>";
          document.getElementById('otherIdDoorData').innerHTML += "<br><img src='" + respo.picture + "' alt='person' width='200' height='185' />";
          document.getElementById('otherIdDoorData').innerHTML += "<p>Hostilité: </p>";

          if (respo.verified) {
            for (let b of respo.hostility) {
              document.getElementById('otherIdDoorData').innerHTML += "<p>-" + b + "</p>";
            }
          } else {
            document.getElementById('otherIdDoorData').innerHTML += "<p>Pas encore vérifié.</p>";
          }

          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    } else {
      switch (parseInt(userLang)) {
        case 0:
          document.getElementById('otherIdDoorData').innerHTML = "<p>Not Found!</p>";
          break;
        case 1:
          document.getElementById('otherIdDoorData').innerHTML = "<p>Pas trouvé!</p>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    }
  });
}

function doorMenuExisting() {
  languageChoice();
  switch (parseInt(userLang)) {
    case 0:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('subtitleId').innerHTML += "<p class='w3-large'>Caballero|Door.</p>";
      document.getElementById('authcontent').innerHTML = "<button onclick='updateIdDoor();'>Update my temporary identifier</button>";
      document.getElementById('authcontent').innerHTML += "<p id='myIdDoor'></p>";
      document.getElementById('authcontent').innerHTML += "<p>Temporary identifier of another person</p>";
      document.getElementById('authcontent').innerHTML += "<input id='otherIdDoor' type='text'><br><br>";
      document.getElementById('authcontent').innerHTML += "<button onclick='otherIdDoorGetData();'>Submit</button>";
      document.getElementById('authcontent').innerHTML += "<div id='otherIdDoorData'></div>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('authcontent').innerHTML += "<p>Logout this service</p>";
      document.getElementById('authcontent').innerHTML += "<button onclick='logoutUser();'>Logout</button>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('authcontent').innerHTML += "<p> Recall Caballero|Door's <a href='PrivacyPolicy.html'>Privacy Policy</a> and the <a href='TermsandConditions.html'>Terms and Conditions</a>.</p>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('authcontent').innerHTML += "<p>Delete my account</p>";
      document.getElementById('authcontent').innerHTML += "<button onclick='deleteUser();'>Delete</button>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      break;
    case 1:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('subtitleId').innerHTML += "<p class='w3-large'>Caballero|Porte.</p>";
      document.getElementById('authcontent').innerHTML = "<button onclick='updateIdDoor();'>Mettre à jour mon identifiant temporaire</button>";
      document.getElementById('authcontent').innerHTML += "<p id='myIdDoor'></p>";
      document.getElementById('authcontent').innerHTML += "<p>Identifiant temporaire d'une autre personne</p>";
      document.getElementById('authcontent').innerHTML += "<input id='otherIdDoor' type='text'><br><br>";
      document.getElementById('authcontent').innerHTML += "<button onclick='otherIdDoorGetData();'>Soumettre</button>";
      document.getElementById('authcontent').innerHTML += "<div id='otherIdDoorData'></div>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('authcontent').innerHTML += "<p>Déconnectez-moi de ce service</p>";
      document.getElementById('authcontent').innerHTML += "<button onclick='logoutUser();'>Déconnexion</button>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('authcontent').innerHTML += "<p> Rappel de <a href='PrivacyPolicyfr.html'>Politique de confidentialité</a> et <a href='TermsandConditionsfr.html'>Termes et conditions</a> chez Caballero|Porte.</p>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('authcontent').innerHTML += "<p>Supprimer mon compte</p>"
      document.getElementById('authcontent').innerHTML += "<button onclick='deleteUser();'>Supprimer</button>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
       break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function doorMenu() {
  const myData = JSON.parse(userData);
  if (myData.services.find(x => x == "door") == undefined) {
    goToPage(5);
  } else {
    goToPage(6);
  }
}


// page selector
// const myData = JSON.parse(userData);
// alert ( JSON.stringify(myData));


switch (page) {
  case "admin":
    adminMenu();
    break;
  case "open":
    openAccount();
    break;
  case "auth":
    existingUser();
    break;
  case "retrieve":
    forgotIdentifier();
    break;
  case "doorNew":
    doorMenuNew();
    break;
  case "doorExisting":
    doorMenuExisting();
    break;
  default:
    introMenu();
    break;
};
