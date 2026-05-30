let currentAnswer = 0;
let selectedOperation = "+";

let stats = {
    correct: 0,
    wrong: 0,
    difficulty: "Easy"
};

let consecutiveCorrect = 0; 
let consecutiveWrong = 0;   

let currentUser = null;
let gameStarted = false;

/* PAGE NAVIGATION */
function showPage(id){
    const pages = document.querySelectorAll(".page");
    pages.forEach(page=>{
        page.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    const navbar = document.getElementById("navbar");
    if(
        id === "dashboard" ||
        id === "operation" ||
        id === "game" ||
        id === "result" ||
        id === "profile" ||
        id === "progress"
    ){
        navbar.style.display = "flex";
    } else {
        navbar.style.display = "none";
    }

    loadHistory();
}

/* SMART BUTTON CONTROLLERS (Checkbox Guard Style) */
function toggleSignupBtn() {
    const agree = document.getElementById("agree");
    const btn = document.getElementById("signupSubmitBtn");
    if(agree.checked) {
        btn.disabled = false;
        btn.classList.remove("disabled-btn");
    } else {
        btn.disabled = true;
        btn.classList.add("disabled-btn");
    }
}

function toggleLoginBtn() {
    const loginAgree = document.getElementById("loginAgree");
    const btn = document.getElementById("loginSubmitBtn");
    if(loginAgree.checked) {
        btn.disabled = false;
        btn.classList.remove("disabled-btn");
    } else {
        btn.disabled = true;
        btn.classList.add("disabled-btn");
    }
}

/* TERMS TRANSITION */
function goTerms(event){
    event.preventDefault();
    showPage("terms");
}

/* SIGNUP ACTION */
function signup(){
    const agree = document.getElementById("agree");
    if(!agree.checked) return;

    const user = {
        name: document.getElementById("signupName").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Account created successfully!");
    
    agree.checked = false;
    toggleSignupBtn();
    
    showPage("login");
}

/* LOGIN ACTION */
function login(event){
    event.preventDefault();
    
    const loginAgree = document.getElementById("loginAgree");
    if(!loginAgree.checked) {
        alert("You must agree to the terms and conditions to login.");
        return;
    }

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if(savedUser == null){
        alert("No account found. Please register first.");
        return;
    }

    if(email === savedUser.email && password === savedUser.password){
        currentUser = savedUser;
        document.getElementById("editName").value = savedUser.name;
        showPage("dashboard");
    } else {
        alert("Incorrect email or password.");
    }
}

/* PROFILE HANDLING */
function saveProfile(){
    currentUser.name = document.getElementById("editName").value;
    localStorage.setItem("user", JSON.stringify(currentUser));
    alert("Profile updated!");
}

function changeProfile(event){
    const file = event.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(e){
            document.getElementById("profilePreview").src = e.target.result;
            document.getElementById("profilePreview").style.display = "block";
            document.getElementById("emptyProfile").style.display = "none";
            document.getElementById("navProfile").src = e.target.result;
            document.getElementById("gameProfile").src = e.target.result;
            localStorage.setItem("profile", e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function removeProfile(){
    localStorage.removeItem("profile");
    document.getElementById("profilePreview").style.display = "none";
    document.getElementById("emptyProfile").style.display = "flex";
    document.getElementById("navProfile").src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    document.getElementById("gameProfile").src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
}

/* OPERATION CHOOSE */
function chooseOperation(operation){
    selectedOperation = operation;
    setDifficulty('Easy'); 
}

function setDifficulty(level){
    stats.difficulty = level;
    gameStarted = true;
    
    stats.correct = 0;
    stats.wrong = 0;
    consecutiveCorrect = 0;
    consecutiveWrong = 0;

    startGame();
}

function startGame(){
    showPage("game");
    let max = 10;

    if(stats.difficulty === "Medium"){
        max = 30;
    }
    if(stats.difficulty === "Hard"){
        max = 100;
    }

    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;

    switch(selectedOperation){
        case "+":
            currentAnswer = a + b;
            break;
        case "-":
            if (a < b) { let temp = a; a = b; b = temp; } 
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

    document.getElementById("question").innerHTML = `
        <span style="font-size: 18px; display: block; color: gray; margin-bottom: 5px; font-weight: normal;">Difficulty: ${stats.difficulty}</span>
        ${a} ${selectedOperation} ${b}
    `;
    document.getElementById("answer").value = "";
}

function submitAnswer(event){
    event.preventDefault();
    const answer = parseInt(document.getElementById("answer").value);
    let feedbackText = "";

    if(answer === currentAnswer){
        stats.correct++;
        consecutiveCorrect++; 
        consecutiveWrong = 0;  

        feedbackText = "Correct Answer! 🎉";

        if(consecutiveCorrect === 5){
            if(stats.difficulty === "Easy"){
                stats.difficulty = "Medium";
                feedbackText += "<br><span style='color: green; font-size: 16px;'>Level Up! Hirap level is now Medium!</span>";
            } else if(stats.difficulty === "Medium"){
                stats.difficulty = "Hard";
                feedbackText += "<br><span style='color: green; font-size: 16px;'>Level Up! Hirap level is now Hard! 🔥</span>";
            }
            consecutiveCorrect = 0; 
        }

    } else {
        stats.wrong++;
        consecutiveWrong++;     
        consecutiveCorrect = 0; 

        feedbackText = `Wrong! Correct Answer: ${currentAnswer} 😢`;

        if(consecutiveWrong === 3){
            if(stats.difficulty === "Hard"){
                stats.difficulty = "Medium";
                feedbackText += "<br><span style='color: orange; font-size: 16px;'>Adjusting difficulty down to Medium...</span>";
            } else if(stats.difficulty === "Medium"){
                stats.difficulty = "Easy";
                feedbackText += "<br><span style='color: orange; font-size: 16px;'>Adjusting difficulty down to Easy...</span>";
            }
            consecutiveWrong = 0; 
        }
    }

    document.getElementById("resultText").innerHTML = feedbackText;
    showPage("result");
}

function endGame(){
    const total = stats.correct + stats.wrong;
    const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    const today = new Date();
    const history = JSON.parse(localStorage.getItem("history")) || [];

    history.unshift({
        date: today.toLocaleDateString(),
        time: today.toLocaleTimeString(),
        correct: stats.correct,
        wrong: stats.wrong,
        accuracy: accuracy
    });

    localStorage.setItem("history", JSON.stringify(history));
    showPage("progress");
}

function loadHistory(){
    const historyList = document.getElementById("historyList");
    if(!historyList) return;

    const history = JSON.parse(localStorage.getItem("history")) || [];
    historyList.innerHTML = "";

    history.forEach(item=>{
        historyList.innerHTML += `
            <div class="history-card">
                <div>📅 ${item.date}</div>
                <div>⏰ ${item.time}</div>
                <div>✅ ${item.correct} Correct</div>
                <div>❌ ${item.wrong} Wrong</div>
                <div>🎯 ${item.accuracy}%</div>
            </div>
        `;
    });
}

/* RUN INITIALIZATION */
window.onload = function(){
    showPage("landing");
    const savedProfile = localStorage.getItem("profile");

    if(savedProfile){
        document.getElementById("profilePreview").src = savedProfile;
        document.getElementById("profilePreview").style.display = "block";
        document.getElementById("emptyProfile").style.display = "none";
        document.getElementById("navProfile").src = savedProfile;
        document.getElementById("gameProfile").src = savedProfile;
    }
    loadHistory();
};