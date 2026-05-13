let currentAnswer = 0;
let selectedOperation = "+";

let stats = { correct:0, wrong:0, difficulty:"Easy" };
let currentUser = null;

/* NAV */
function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");

document.getElementById("navbar").style.display =
["dashboard","operation","difficulty","game","result","profile","progress"].includes(id)
? "flex":"none";

updateStats();
}

/* SIGNUP / LOGIN */
function signup(){
const user = {
name:signupName.value,
email:signupEmail.value,
password:signupPassword.value
};
localStorage.setItem("user",JSON.stringify(user));
showPage("login");
}

function login(e){
e.preventDefault();
const u = JSON.parse(localStorage.getItem("user"));
if(!u) return alert("No account");

if(loginEmail.value===u.email && loginPassword.value===u.password){
currentUser=u;
editName.value=u.name;
showPage("dashboard");
}
}

/* PROFILE */
function changeProfile(e){
const r = new FileReader();
r.onload = x=>{
localStorage.setItem("profile",x.target.result);
profilePreview.src=x.target.result;
profilePreview.classList.remove("hidden-profile");
emptyProfile.style.display="none";
navProfile.src=x.target.result;
gameProfile.src=x.target.result;
};
r.readAsDataURL(e.target.files[0]);
}

function removeProfile(){
localStorage.removeItem("profile");
profilePreview.classList.add("hidden-profile");
emptyProfile.style.display="flex";
}

/* GAME */
function chooseOperation(op){selectedOperation=op;showPage("difficulty");}

function setDifficulty(l){stats.difficulty=l;startGame();}

function startGame(){
showPage("game");

let max = stats.difficulty==="Hard"?100:stats.difficulty==="Medium"?30:10;

let a=Math.floor(Math.random()*max)+1;
let b=Math.floor(Math.random()*max)+1;

if(selectedOperation=="/"){currentAnswer=a;a=a*b;}
else if(selectedOperation=="+")currentAnswer=a+b;
else if(selectedOperation=="-")currentAnswer=a-b;
else currentAnswer=a*b;

question.textContent=`${a} ${selectedOperation} ${b}`;
answer.value="";
}

function submitAnswer(e){
e.preventDefault();

if(+answer.value===currentAnswer) stats.correct++;
else stats.wrong++;

adjustDifficulty();
updateStats();
showPage("result");
}

/* FIXED */
function adjustDifficulty(){
let t=stats.correct+stats.wrong;
let a=t?stats.correct/t*100:0;

stats.difficulty =
a>=80?"Hard":a>=50?"Medium":"Easy";
}

function updateStats(){
let t=stats.correct+stats.wrong;
let a=t?Math.round(stats.correct/t*100):0;

correctDisplay.textContent=stats.correct;
wrongDisplay.textContent=stats.wrong;
accuracyDisplay.textContent=a+"%";
difficultyDisplay.textContent=stats.difficulty;

progressCorrect.textContent=stats.correct;
progressWrong.textContent=stats.wrong;
progressAccuracy.textContent=a+"%";
}

/* INIT */
window.onload=()=>{
showPage("landing");

let p=localStorage.getItem("profile");
if(p){
profilePreview.src=p;
profilePreview.classList.remove("hidden-profile");
emptyProfile.style.display="none";
navProfile.src=p;
gameProfile.src=p;
}

let u=JSON.parse(localStorage.getItem("user"));
if(u){currentUser=u;editName.value=u.name;}
};