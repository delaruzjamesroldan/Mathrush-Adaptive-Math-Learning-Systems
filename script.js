let currentAnswer = 0;

let selectedOperation = "+";

let stats = {
correct:0,
wrong:0,
difficulty:"Easy"
};

let currentUser = null;

let gameStarted = false;

/* PAGE */

function showPage(id){

const pages =
document.querySelectorAll(".page");

pages.forEach(page=>{
page.classList.remove("active");
});

document
.getElementById(id)
.classList.add("active");

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

loadHistory();
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
alert("Please agree first.");
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

alert("Account created!");

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
JSON.parse(localStorage.getItem("user"));

if(savedUser == null){

alert("No account found.");
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

/* CLEAR LOGIN INPUTS */

document
.getElementById("loginEmail")
.value = "";

document
.getElementById("loginPassword")
.value = "";

/* GO DASHBOARD */

showPage("dashboard");

}else{

alert("Incorrect email or password.");

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

gameStarted = true;

stats.correct = 0;
stats.wrong = 0;

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

showPage("result");
}

/* END GAME */

function endGame(){

const total =
stats.correct + stats.wrong;

const accuracy =
Math.round(
(stats.correct / total) * 100
);

const today =
new Date();

const history = JSON.parse(
localStorage.getItem("history")
) || [];

history.unshift({

date:
today.toLocaleDateString(),

time:
today.toLocaleTimeString(),

correct:
stats.correct,

wrong:
stats.wrong,

accuracy:
accuracy

});

localStorage.setItem(
"history",
JSON.stringify(history)
);

showPage("progress");
}

/* LOAD HISTORY */

function loadHistory(){

const historyList =
document.getElementById("historyList");

if(!historyList) return;

const history =
JSON.parse(
localStorage.getItem("history")
) || [];

historyList.innerHTML = "";

history.forEach(item=>{

historyList.innerHTML += `

<div class="history-card">

<div>
📅 ${item.date}
</div>

<div>
⏰ ${item.time}
</div>

<div>
✅ ${item.correct} Correct
</div>

<div>
❌ ${item.wrong} Wrong
</div>

<div>
🎯 ${item.accuracy}%
</div>

</div>

`;

});
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

loadHistory();

};