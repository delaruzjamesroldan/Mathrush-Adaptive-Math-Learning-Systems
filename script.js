let currentAnswer = 0;
let selectedOperation = "+";

// Nagdagdag ng counters para sa dynamic tracking
let stats = {
    correct: 0,
    wrong: 0,
    difficulty: "Easy"
};

let consecutiveCorrect = 0; // Dagdag: Taga-bilang ng sunod-sunod na tama
let consecutiveWrong = 0;   // Dagdag: Taga-bilang ng sunod-sunod na mali

let currentUser = null;
let gameStarted = false;

/* PAGE */
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
        id === "difficulty" ||
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

/* TERMS */
function goTerms(event){
    event.preventDefault();
    showPage("terms");
}

/* SIGNUP */
function signup(){
    const agree = document.getElementById("agree");
    if(!agree.checked){
        alert("Please agree first.");
        return;
    }

    const user = {
        name: document.getElementById("signupName").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Account created!");
    showPage("login");
}

/* LOGIN */
function login(event){
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if(savedUser == null){
        alert("No account found.");
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

/* PROFILE */
function saveProfile(){
    currentUser.name = document.getElementById("editName").value;
    localStorage.setItem("user", JSON.stringify(currentUser));
    alert("Profile updated!");
}

/* CHANGE PROFILE */
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

/* REMOVE PROFILE */
function removeProfile(){
    localStorage.removeItem("profile");
    document.getElementById("profilePreview").style.display = "none";
    document.getElementById("emptyProfile").style.display = "flex";
    document.getElementById("navProfile").src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    document.getElementById("gameProfile").src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
}

/* OPERATION */
function chooseOperation(operation){
    selectedOperation = operation;
    
    // Binago: Imbis na papiliin pa ng simulaang difficulty, kusa nating iseset sa "Easy" 
    // para ang system na mismo ang mag-adjust habang naglalaro sila.
    setDifficulty('Easy'); 
}

/* DIFFICULTY */
function setDifficulty(level){
    stats.difficulty = level;
    gameStarted = true;
    
    // Reset ang counters tuwing bago ang sesyon ng assessment
    stats.correct = 0;
    stats.wrong = 0;
    consecutiveCorrect = 0;
    consecutiveWrong = 0;

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

    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;

    switch(selectedOperation){
        case "+":
            currentAnswer = a + b;
            break;
        case "-":
            // Likha ng paraan para hindi mag-negatibo sa subtraction (lalo na sa bata)
            if (a < b) { let temp = a; a = b; b = temp; }
            currentAnswer = a - b;
            break;
        case "*":
            currentAnswer = a * b;
            break;
        case "/":
            currentAnswer = a;
            a = a * b; // Sinisiguradong walang remainder ang division
            break;
    }

    // May maliit na text indicator sa tabi para makita ng user anong kasalukuyang Level/Difficulty nila
    document.getElementById("question").innerHTML = `
        <span style="font-size: 18px; display: block; color: gray; margin-bottom: 5px;">Difficulty: ${stats.difficulty}</span>
        ${a} ${selectedOperation} ${b}
    `;
    document.getElementById("answer").value = "";
}

/* SUBMIT */
function submitAnswer(event){
    event.preventDefault();
    const answer = parseInt(document.getElementById("answer").value);
    let feedbackText = "";

    if(answer === currentAnswer){
        stats.correct++;
        consecutiveCorrect++; // Dagdag sa sunod-sunod na tama
        consecutiveWrong = 0;  // I-reset ang mali kasi tumama siya

        feedbackText = "Correct Answer! 🎉";

        // ADAPTIVE LOGIC: Itataas ang difficulty kapag naka-5 consecutive correct answers
        if(consecutiveCorrect === 5){
            if(stats.difficulty === "Easy"){
                stats.difficulty = "Medium";
                feedbackText += "<br><span style='color: green; font-size: 16px;'>Level Up! Hirap level is now Medium!</span>";
            } else if(stats.difficulty === "Medium"){
                stats.difficulty = "Hard";
                feedbackText += "<br><span style='color: green; font-size: 16px;'>Level Up! Hirap level is now Hard! 🔥</span>";
            }
            consecutiveCorrect = 0; // I-reset ulit ang counter pagka-level up
        }

    } else {
        stats.wrong++;
        consecutiveWrong++;     // Dagdag sa sunod-sunod na mali
        consecutiveCorrect = 0; // I-reset ang tama kasi nagkamali siya

        feedbackText = `Wrong! Correct Answer: ${currentAnswer} 😢`;

        // ADAPTIVE LOGIC: Ibababa ang difficulty kapag naka-3 consecutive wrong answers
        if(consecutiveWrong === 3){
            if(stats.difficulty === "Hard"){
                stats.difficulty = "Medium";
                feedbackText += "<br><span style='color: orange; font-size: 16px;'>Adjusting difficulty down to Medium...</span>";
            } else if(stats.difficulty === "Medium"){
                stats.difficulty = "Easy";
                feedbackText += "<br><span style='color: orange; font-size: 16px;'>Adjusting difficulty down to Easy...</span>";
            }
            consecutiveWrong = 0; // I-reset ulit ang counter pagka-level down
        }
    }

    document.getElementById("resultText").innerHTML = feedbackText;
    showPage("result");
}

/* END GAME */
function endGame(){
    const total = stats.correct + stats.wrong;
    
    // Iwasan ang Error (Division by Zero) kung sakaling i-end agad ang game nang walang sagot
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

/* LOAD HISTORY */
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

/* START */
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