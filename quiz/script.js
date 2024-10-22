const questions = [
  {
    question: "Which one of the following is a synonym for the word 'happy'?",
    answers: [
      { text: "Sad", correct: false },
      { text: "Angry", correct: false },
      { text: "Joyful", correct: true },
      { text: "Tired", correct: false },
    ],
  },
  {
    question: "What is the past tense of the verb 'go'?",
    answers: [
      { text: "Go", correct: false },
      { text: "Went", correct: true },
      { text: "Gone", correct: false },
      { text: "Going", correct: false },
    ],
  },
  {
    question: "Which of the following is a fruit?",
    answers: [
      { text: "Carrot", correct: false },
      { text: "Potato", correct: false },
      { text: "Apple", correct: true },
      { text: "Lettuce", correct: false },
    ],
  },
  {
    question: "How many legs does a spider have?",
    answers: [
      { text: "Six", correct: false },
      { text: "Eight", correct: true },
      { text: "Ten", correct: false },
      { text: "Twelve", correct: false },
    ],
  },
  {
    question: "Which one of these is a color?",
    answers: [
      { text: "Dog", correct: false },
      { text: "Tree", correct: false },
      { text: "Red", correct: true },
      { text: "Sky", correct: false },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answerbuttons");
const nextButton = document.getElementById("next");
const indicatorElement = document.getElementById("indicator");
const titleElement = document.getElementById("title-quiz");

let currentQuestionIndex = 0;
let score = 0;

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

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  titleElement.style.display = "none";
  questionElement.style.textAlign = "center";
  indicatorElement.innerHTML = `Quiz Complete`;
  nextButton.innerHTML = "Restart";
  nextButton.style.display = "block";
  nextButton.addEventListener("click", startQuiz);
}

startQuiz();
