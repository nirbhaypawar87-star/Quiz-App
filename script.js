// ==========================
// Questions
// ==========================
let questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyperlinks Text Mark Language", correct: false },
            { text: "Hyper Tool Multi Language", correct: false }
        ]
    },
    {
        question: "Which language is used for styling web pages?",
        answers: [
            { text: "HTML", correct: false },
            { text: "CSS", correct: true },
            { text: "Python", correct: false },
            { text: "Java", correct: false }
        ]
    },
    {
        question: "Which language is used to make web pages interactive?",
        answers: [
            { text: "CSS", correct: false },
            { text: "JavaScript", correct: true },
            { text: "Java", correct: false },
            { text: "SQL", correct: false }
        ]
    },
    {
        question: "Which tag is used for the largest heading?",
        answers: [
            { text: "<h6>", correct: false },
            { text: "<h1>", correct: true },
            { text: "<head>", correct: false },
            { text: "<title>", correct: false }
        ]
    },
    {
        question: "Which company developed JavaScript?",
        answers: [
            { text: "Google", correct: false },
            { text: "Netscape", correct: true },
            { text: "Apple", correct: false },
            { text: "Microsoft", correct: false }
        ]
    }
];

// ==========================
// HTML Elements
// ==========================
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const timeElement = document.getElementById("time");
const progressBar = document.querySelector(".progress-bar");
const highScoreElement = document.getElementById("high-score");
const themeButton = document.getElementById("theme-btn");
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const winSound = new Audio("sounds/win.mp3");

// ==========================
// Variables
// ==========================
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let highScore = localStorage.getItem("highScore") || 0;

highScoreElement.innerHTML = highScore;
// Load saved theme
let darkMode = localStorage.getItem("darkMode");

if (darkMode === "enabled") {
    document.body.classList.add("dark");
    themeButton.innerHTML = "☀️ Light Mode";
}

// ==========================
// Start Timer
// ==========================
function startTimer() {

    clearInterval(timer);

    timeLeft = 30;
    timeElement.innerHTML = timeLeft;

    timer = setInterval(() => {

        timeLeft--;
        timeElement.innerHTML = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timer);

            Array.from(answerButtons.children).forEach(button => {

                button.disabled = true;

                if (button.dataset.correct === "true") {
                    button.style.background = "#16a34a";
                    button.style.color = "white";
                }

            });

            nextButton.style.display = "block";

        }

    }, 1000);

}

// ==========================
// Progress Bar
// ==========================
function updateProgressBar() {

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    progressBar.style.width = progress + "%";

}

// ==========================
// Theme Toggle
// ==========================
themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("darkMode", "enabled");
        themeButton.innerHTML = "☀️ Light Mode";

    } else {

        localStorage.setItem("darkMode", "disabled");
        themeButton.innerHTML = "🌙 Dark Mode";

    }

});

// ==========================
// Shuffle Questions
// ==========================
function shuffleQuestions() {

    for (let i = questions.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [questions[i], questions[j]] =
        [questions[j], questions[i]];

    }

}

// ==========================
// Show Question
// ==========================
function showQuestion() {

    resetState();

    startTimer();

    updateProgressBar();

    const currentQuestion = questions[currentQuestionIndex];

    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {

        const button = document.createElement("button");

        button.innerHTML = answer.text;

        button.classList.add("btn");

        if (answer.correct) {
            button.dataset.correct = "true";
        }

        button.addEventListener("click", selectAnswer);

        answerButtons.appendChild(button);

    });

}

// ==========================
// Reset State
// ==========================
function resetState() {

    nextButton.style.display = "none";

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }

}

// ==========================
// Select Answer
// ==========================
function selectAnswer(e) {

    clearInterval(timer);

    const selectedBtn = e.target;

    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {

    score++;

    correctSound.play();   // ✅ Play correct sound

    selectedBtn.style.background = "#16a34a";
    selectedBtn.style.color = "white";

} else {

    wrongSound.play();     // ❌ Play wrong sound

    selectedBtn.style.background = "#dc2626";
    selectedBtn.style.color = "white";

}

    Array.from(answerButtons.children).forEach(button => {

        if (button.dataset.correct === "true") {

            button.style.background = "#16a34a";
            button.style.color = "white";

        }

        button.disabled = true;

    });

    nextButton.style.display = "block";

}

// ==========================
// Next Button
// ==========================
nextButton.addEventListener("click", () => {

    if (nextButton.innerHTML === "Restart Quiz") {
        restartQuiz();
        return;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }

});

// ==========================
// Confetti Animation
// ==========================
function launchConfetti() {

    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
    });

}

// ==========================
// Show Score
// ==========================
function showScore() {

    clearInterval(timer);

    resetState();

    progressBar.style.width = "100%";

    // Update High Score
    if (score > highScore) {

        highScore = score;

        localStorage.setItem("highScore", highScore);

        highScoreElement.innerHTML = highScore;

    }

    // Statistics
    const wrongAnswers = questions.length - score;
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 80) {
    launchConfetti();
    winSound.play();
}

    // Performance Message
    let message = "";
    let emoji = "";

    if (percentage === 100) {
        emoji = "🏆";
        message = "Excellent!";
    }
    else if (percentage >= 80) {
        emoji = "🎉";
        message = "Great Job!";
    }
    else if (percentage >= 60) {
        emoji = "😊";
        message = "Good Work!";
    }
    else if (percentage >= 40) {
        emoji = "🙂";
        message = "Keep Practicing!";
    }
    else {
        emoji = "📚";
        message = "Don't Give Up!";
    }

    questionElement.innerHTML = `
        <div class="result-box">

            <h2>${emoji} ${message}</h2>

            <h3>Your Score : ${score} / ${questions.length}</h3>

            <p>✅ Correct Answers : ${score}</p>

            <p>❌ Wrong Answers : ${wrongAnswers}</p>

            <p>📊 Percentage : ${percentage}%</p>

            <p>🏆 High Score : ${highScore}</p>

        </div>
    `;

    nextButton.innerHTML = "Restart Quiz";
    nextButton.style.display = "block";

}

// ==========================
// Restart Quiz
// ==========================
function restartQuiz() {

    clearInterval(timer);

    currentQuestionIndex = 0;
    score = 0;

    progressBar.style.width = "0%";

    nextButton.innerHTML = "Next";

    shuffleQuestions();

    showQuestion();

}

// ==========================
// Start Quiz
// ==========================
showQuestion();