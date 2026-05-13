let currentAnswer = 0;

let selectedOperation = "+";

let stats = {
correct:0,
wrong:0,
difficulty:"Easy"
};

let currentUser = null;

/* PAGE NAVIGATION */

function showPage(id){

const pages =
document.querySelectorAll(".page");

pages.forEach(page=>{

page.classList.remove("active");

});

document
.getElementById(id)
.classList.add("active");

/* NAVBAR */

const navbar =
document.getElementById("navbar");

if(
id === "dashboard" ||
id === "operation" ||
id === "difficulty" ||
id === "game" ||
id === "result" ||
id === "profile" ||
id === "progress"
){

navbar.style.display = "flex";

}else{

navbar.style.display = "none";
}

updateStats();
}

/* TERMS */

function goTerms(event){

event.preventDefault();

showPage("terms");
}

/* SIGNUP */

function signup(){

const agree =
document.getElementById("agree");

if(!agree.checked){

alert(
"Please agree first."
);

return;
}

const user = {

name:
document.getElementById("signupName").value,

email:
document.getElementById("signupEmail").value,

password:
document.getElementById("signupPassword").value
};

localStorage.setItem(
"user",
JSON.stringify(user)
);

alert(
"Account created successfully!"
);

showPage("login");
}

/* LOGIN */

function login(event){

event.preventDefault();

const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

const savedUser =
JSON.parse(
localStorage.getItem("user")
);

if(savedUser == null){

alert(
"No account found."
);

return;
}

if(
email === savedUser.email &&
password === savedUser.password
){

currentUser = savedUser;

document
.getElementById("editName")
.value =
savedUser.name;

showPage("dashboard");

}else{

alert(
"Incorrect email or password."
);
}
}

/* PROFILE */

function saveProfile(){

currentUser.name =
document
.getElementById("editName").value;

localStorage.setItem(
"user",
JSON.stringify(currentUser)
);

alert(
"Profile updated!"
);
}

/* CHANGE PROFILE */

function changeProfile(event){

const file =
event.target.files[0];

if(file){

const reader =
new FileReader();

reader.onload = function(e){

document
.getElementById("profilePreview")
.src = e.target.result;

document
.getElementById("profilePreview")
.style.display = "block";

document
.getElementById("emptyProfile")
.style.display = "none";

document
.getElementById("navProfile")
.src = e.target.result;

document
.getElementById("gameProfile")
.src = e.target.result;

localStorage.setItem(
"profile",
e.target.result
);
};

reader.readAsDataURL(file);
}
}

/* REMOVE PROFILE */

function removeProfile(){

localStorage.removeItem("profile");

document
.getElementById("profilePreview")
.style.display = "none";

document
.getElementById("emptyProfile")
.style.display = "flex";

document
.getElementById("navProfile")
.src =
"https://cdn-icons-png.flaticon.com/512/149/149071.png";

document
.getElementById("gameProfile")
.src =
"https://cdn-icons-png.flaticon.com/512/149/149071.png";
}

/* OPERATION */

function chooseOperation(operation){

selectedOperation = operation;

showPage("difficulty");
}

/* DIFFICULTY */

function setDifficulty(level){

stats.difficulty = level;

startGame();
}

/* START GAME */

function startGame(){

showPage("game");

let max = 10;

if(stats.difficulty === "Medium"){
max = 30;
}

if(stats.difficulty === "Hard"){
max = 100;
}

let a =
Math.floor(Math.random()*max)+1;

let b =
Math.floor(Math.random()*max)+1;

switch(selectedOperation){

case "+":
currentAnswer = a+b;
break;

case "-":
currentAnswer = a-b;
break;

case "*":
currentAnswer = a*b;
break;

case "/":

currentAnswer = a;

a = a*b;

break;
}

document
.getElementById("question")
.textContent =
`${a} ${selectedOperation} ${b}`;

document
.getElementById("answer")
.value = "";
}

/* SUBMIT */

function submitAnswer(event){

event.preventDefault();

const answer =
parseInt(
document
.getElementById("answer").value
);

if(answer === currentAnswer){

stats.correct++;

document
.getElementById("resultText")
.textContent =
"Correct Answer!";

}else{

stats.wrong++;

document
.getElementById("resultText")
.textContent =
`Wrong! Correct Answer: ${currentAnswer}`;
}

adjustDifficulty();

updateStats();

showPage("result");
}

/* ADAPTIVE */

function adjustDifficulty(){

const total =
stats.correct + stats.wrong;

const accuracy =
(total > 0)
?
(stats.correct/total)*100
:
0;

if(accuracy >= 80){

stats.difficulty = "Hard";

}else if(accuracy >= 50){

stats.difficulty = "Medium";

}else{

stats.difficulty = "Easy";
}
}

/* UPDATE */

function updateStats(){

const total =
stats.correct + stats.wrong;

const accuracy =
(total > 0)
?
Math.round(
(stats.correct/total)*100
)
:
0;

/* DASHBOARD */

document
.getElementById("dashboardAccuracy")
.textContent =
accuracy + "%";

document
.getElementById("dashboardDifficulty")
.textContent =
stats.difficulty;

/* PROGRESS */

document
.getElementById("progressCorrect")
.textContent =
stats.correct;

document
.getElementById("progressWrong")
.textContent =
stats.wrong;

document
.getElementById("progressAccuracy")
.textContent =
accuracy + "%";
}

/* START */

window.onload = function(){

showPage("landing");

const savedProfile =
localStorage.getItem("profile");

if(savedProfile){

document
.getElementById("profilePreview")
.src = savedProfile;

document
.getElementById("profilePreview")
.style.display = "block";

document
.getElementById("emptyProfile")
.style.display = "none";

document
.getElementById("navProfile")
.src = savedProfile;

document
.getElementById("gameProfile")
.src = savedProfile;
}
};