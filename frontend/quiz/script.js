const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answerbuttons");
const nextButton = document.getElementById("next");
const indicatorElement = document.getElementById("indicator");
const titleElement = document.getElementById("title-quiz");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuizData(level) {
  try {
    const response = await fetch(`http://localhost:3000/api/quizzes?level=${level}`);
    const quiz = await response.json();
    questions = quiz.Questions.map((q) => ({
      question: q.question,
      answers: [
        { text: q.option_a, correct: q.correct_option === "A" },
        { text: q.option_b, correct: q.correct_option === "B" },
        { text: q.option_c, correct: q.correct_option === "C" },
        { text: q.option_d, correct: q.correct_option === "D" },
      ],
    }));
    startQuiz();
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  titleElement.style.display = "block";
  nextButton.innerHTML = "Berikutnya";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  // Update question indicator
  indicatorElement.innerHTML = `${questionNo} of ${questions.length} Questions`;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    button.style.marginBottom = "5px";
    button.style.fontSize = "14px";
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerbuttons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerbuttons.firstChild) {
    answerbuttons.removeChild(answerbuttons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  if (isCorrect) {
    selectedButton.classList.add("correct");
    selectedButton.style.backgroundColor = "#A5ED6E";
    selectedButton.style.color = "black";

    score++;
  } else {
    selectedButton.classList.add("incorrect");
    selectedButton.style.backgroundColor = "#FF4B4B";
    selectedButton.style.color = "white";
  }

  Array.from(answerButton.children).forEach((button) => {
    if (button.dataset.correct) {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

async function submitQuizResult() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/submit-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        score: score,
        totalQuestions: questions.length,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while submitting the quiz result. Please try again.");
  }
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  titleElement.style.display = "none";
  questionElement.style.textAlign = "center";
  indicatorElement.innerHTML = `Quiz Complete`;
  // Submit the quiz result to the backend
  submitQuizResult();
  nextButton.innerHTML = "Kembali ke Halaman Level";
  nextButton.style.display = "block";
  nextButton.onclick = redirectToLevelPage; // Ganti dengan langsung memanggil fungsi
}

function redirectToLevelPage() {
  const userLevel = sessionStorage.getItem("level");
  if (userLevel) {
    window.location.href = `../belajar/level${userLevel}.html`;
  } else {
    alert("User level not found. Redirecting to home page.");
    window.location.href = "../index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get("level");
  if (level) {
    fetchQuizData(level);
  } else {
    alert("Level not specified. Redirecting to home page.");
    window.location.href = "../index.html";
  }
});
