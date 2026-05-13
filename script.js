let currentAnswer = 0;
let selectedOperation = "+";

let stats = {
correct: 0,
wrong: 0,
difficulty: "Easy"
};

let currentUser = null;

/* PAGE NAVIGATION */
function showPage(id) {

const pages = document.querySelectorAll(".page");

pages.forEach(page => {
page.classList.remove("active");
});

const target = document.getElementById(id);
if (target) target.classList.add("active");

/* NAVBAR CONTROL */
const navbar = document.getElementById("navbar");

const showNavPages = [
"dashboard",
"operation",
"difficulty",
"game",
"result",
"profile",
"progress"
];

if (showNavPages.includes(id)) {
navbar.style.display = "flex";
} else {
navbar.style.display = "none";
}

updateStats();
}

/* TERMS */
function goTerms(event) {
event.preventDefault();
showPage("terms");
}

/* SIGNUP */
function signup() {

const agree = document.getElementById("agree");

if (!agree.checked) {
alert("Please agree to terms first.");
return;
}

const user = {
name: document.getElementById("signupName").value,
email: document.getElementById("signupEmail").value,
password: document.getElementById("signupPassword").value
};

localStorage.setItem("user", JSON.stringify(user));

alert("Account created successfully!");

showPage("login");
}

/* LOGIN */
function login(event) {
event.preventDefault();

const email = document.getElementById("loginEmail").value;
const password = document.getElementById("loginPassword").value;

const savedUser = JSON.parse(localStorage.getItem("user"));

if (!savedUser) {
alert("No account found.");
return;
}

if (email === savedUser.email && password === savedUser.password) {

currentUser = savedUser;

document.getElementById("editName").value = savedUser.name;

showPage("dashboard");

} else {
alert("Incorrect email or password.");
}
}

/* SAVE PROFILE */
function saveProfile() {

if (!currentUser) return;

currentUser.name = document.getElementById("editName").value;

localStorage.setItem("user", JSON.stringify(currentUser));

alert("Profile updated!");
}

/* CHANGE PROFILE */
function changeProfile(event) {

const file = event.target.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = function (e) {

const img = e.target.result;

document.getElementById("profilePreview").src = img;
document.getElementById("profilePreview").classList.remove("hidden-profile");

document.getElementById("emptyProfile").style.display = "none";

document.getElementById("navProfile").src = img;
document.getElementById("gameProfile").src = img;

localStorage.setItem("profile", img);
};

reader.readAsDataURL(file);
}

/* REMOVE PROFILE */
function removeProfile() {

localStorage.removeItem("profile");

document.getElementById("profilePreview").classList.add("hidden-profile");
document.getElementById("emptyProfile").style.display = "flex";

const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

document.getElementById("navProfile").src = defaultImg;
document.getElementById("gameProfile").src = defaultImg;
}

/* OPERATION */
function chooseOperation(op) {
selectedOperation = op;
showPage("difficulty");
}

/* DIFFICULTY */
function setDifficulty(level) {
stats.difficulty = level;
startGame();
}

/* START GAME */
function startGame() {

showPage("game");

let max =
stats.difficulty === "Hard" ? 100 :
stats.difficulty === "Medium" ? 30 : 10;

let a = Math.floor(Math.random() * max) + 1;
let b = Math.floor(Math.random() * max) + 1;

switch (selectedOperation) {

case "+":
currentAnswer = a + b;
break;

case "-":
currentAnswer = a - b;
break;

case "*":
currentAnswer = a * b;
break;

case "/":
currentAnswer = a;
a = a * b;
break;
}

document.getElementById("question").textContent =
`${a} ${selectedOperation} ${b}`;

document.getElementById("answer").value = "";
}

/* SUBMIT */
function submitAnswer(event) {
event.preventDefault();

const answer = parseInt(document.getElementById("answer").value);

if (answer === currentAnswer) {
stats.correct++;
document.getElementById("resultText").textContent = "Correct Answer!";
} else {
stats.wrong++;
document.getElementById("resultText").textContent =
`Wrong! Correct Answer: ${currentAnswer}`;
}

adjustDifficulty();
updateStats();
showPage("result");
}

/* ADAPTIVE DIFFICULTY */
function adjustDifficulty() {

const total = stats.correct + stats.wrong;

const accuracy = total ? (stats.correct / total) * 100 : 0;

if (accuracy >= 80) {
stats.difficulty = "Hard";
} else if (accuracy >= 50) {
stats.difficulty = "Medium";
} else {
stats.difficulty = "Easy";
}
}

/* UPDATE STATS */
function updateStats() {

const total = stats.correct + stats.wrong;
const accuracy = total ? Math.round((stats.correct / total) * 100) : 0;

const set = (id, value) => {
const el = document.getElementById(id);
if (el) el.textContent = value;
};

set("correctDisplay", stats.correct);
set("wrongDisplay", stats.wrong);
set("accuracyDisplay", accuracy + "%");
set("difficultyDisplay", stats.difficulty);

set("progressCorrect", stats.correct);
set("progressWrong", stats.wrong);
set("progressAccuracy", accuracy + "%");
}

/* INIT */
window.onload = function () {

showPage("landing");

const savedProfile = localStorage.getItem("profile");

if (savedProfile) {

document.getElementById("profilePreview").src = savedProfile;
document.getElementById("profilePreview").classList.remove("hidden-profile");

document.getElementById("emptyProfile").style.display = "none";

document.getElementById("navProfile").src = savedProfile;
document.getElementById("gameProfile").src = savedProfile;
}
};