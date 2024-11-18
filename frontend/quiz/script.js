const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answerbuttons");
const nextButton = document.getElementById("next");
const indicatorElement = document.getElementById("indicator");
const titleElement = document.getElementById("title-quiz");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuizData(level) {
  // Fetch quiz data based on the level
  console.log("Fetching quiz data for level", level);
  sessionStorage.setItem("quizId", level);
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(`https://capy-lingo-backend.vercel.app/api/quizzes?level=${level}`, {
      method: "GET",
      headers: {
        Authorization: token, // Include the token in the request headers
        "Content-Type": "application/json",
      },
    });
    console.log("Response:", response);
    const quiz = await response.json();
    if (response.ok) {
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
    } else {
      console.error("Error fetching quiz data:", quiz.message);
      alert("An error occurred while fetching the quiz data. Please try again.");
    }
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
    submitQuizResult();
  }
});

async function submitQuizResult() {
  const userId = sessionStorage.getItem("userId");
  const quizId = sessionStorage.getItem("quizId");
  const token = sessionStorage.getItem("token");
  if (!userId || !quizId) {
    alert("User or Quiz not identified");
    return;
  }

  // Show the loading spinner while waiting for the result to be submitted
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.style.display = "flex";

  try {
    const response = await fetch("https://capy-lingo-backend.vercel.app/api/submit-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Include the token in the request headers
      },
      body: JSON.stringify({
        userId: userId,
        quizId: quizId,
        score: score,
        totalQuestions: questions.length,
      }),
    });

    const result = await response.json();
    // Hide the loading spinner once the request is complete
    loadingIndicator.style.display = "none";
    if (response.ok) {
      sessionStorage.setItem("level", result.newLevel); // Update the level in sessionStorage
      alert(result.message);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while submitting the quiz result. Please try again.");
    // Hide the loading spinner in case of error
    loadingIndicator.style.display = "none";
  }
  showScore();
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  if (score >= 2 && sessionStorage.getItem("level") < 5 && sessionStorage.getItem("level") == sessionStorage.getItem("quizId")) {
    questionElement.innerHTML += "<br>You passed the quiz! Your level is increased.";
  } else if (score >= 2 && sessionStorage.getItem("level") == 5 && sessionStorage.getItem("quizId" == 5)) {
    questionElement.innerHTML += "<br>You have completed all levels!";
    questionElement.innerHTML += "<br>Capybara says: Congratulations!";

    // Create a container for the image
    const imgContainer = document.createElement("div");
    imgContainer.style.textAlign = "center";
    imgContainer.style.marginTop = "20px"; // Add some space above the image

    // Add image to the container
    const img = document.createElement("img");
    img.src = "../pictures/capybara_win.png";
    img.style.width = "30%";
    img.style.height = "auto";
    imgContainer.appendChild(img);

    // Append the container to the question element
    questionElement.appendChild(imgContainer);
  } else if (score < 2) {
    questionElement.innerHTML += "<br>You failed the quiz! Try again!";
  }
  titleElement.style.display = "none";
  questionElement.style.textAlign = "center";
  indicatorElement.innerHTML = `Quiz Complete`;

  // Submit the quiz result to the backend only once

  nextButton.innerHTML = "Restart";
  nextButton.removeEventListener("click", showQuestion); // Remove previous event listener
  nextButton.style.display = "none ";

  // Add button to redirect to the level page
  const redirectButton = document.createElement("button");
  redirectButton.innerHTML = "Dashboard";
  redirectButton.classList.add("back");
  redirectButton.style.display = "block";
  redirectButton.style.margin = "0 auto";
  redirectButton.style.marginTop = "10px";
  redirectButton.style.backgroundColor = "#4CAF50";
  redirectButton.style.color = "white";
  redirectButton.style.border = "none";
  redirectButton.style.borderRadius = "5px";
  redirectButton.style.padding = "10px 24px";
  redirectButton.style.cursor = "pointer";
  //make the button to the right side
  redirectButton.style.position = "absolute";
  redirectButton.style.right = "25px"; // Atur jarak dari kanan sesuai keinginan
  redirectButton.style.bottom = "20px"; // Atur jarak dari atas jika perlu
  //give animation to the button
  redirectButton.style.transition = "all 0.3s ease";
  //give shadow to the button
  redirectButton.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.2)";
  //give hover effect
  redirectButton.style.transform = "translateY(-2px)";

  //font
  redirectButton.style.fontFamily = "Poppins";
  redirectButton.style.fontSize = "14px";

  redirectButton.addEventListener("click", redirectToLevelPage);
  document.querySelector(".bottom").appendChild(redirectButton);
}

function restartQuiz() {
  startQuiz();
}

async function redirectToLevelPage() {
  const userLevel = sessionStorage.getItem("level");

  // Redirect to the level page
  window.location.href = `../belajar/level${userLevel}.html`;
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
