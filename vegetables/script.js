const words = document.querySelectorAll(".word");
const definitions = document.querySelectorAll(".definition");

words.forEach((word) => {
  word.addEventListener("dragstart", dragStart);
  word.addEventListener("dragend", dragEnd);

  // Tambahkan touch event listeners untuk perangkat mobile
  word.addEventListener("touchstart", touchStart);
  word.addEventListener("touchmove", touchMove);
  word.addEventListener("touchend", touchEnd);
});

definitions.forEach((definition) => {
  definition.addEventListener("dragover", dragOver);
  definition.addEventListener("dragenter", dragEnter);
  definition.addEventListener("dragleave", dragLeave);
  definition.addEventListener("drop", dragDrop);

  // Tambahkan touch event listeners untuk perangkat mobile
  definition.addEventListener("touchmove", touchOver);
  definition.addEventListener("touchstart", touchEnter);
  definition.addEventListener("touchend", touchDrop);
});

let draggedWord = null;
let touchWord = null;

function dragStart(e) {
  draggedWord = e.target;
  setTimeout(() => (e.target.style.display = "none"), 0);
}

function dragEnd(e) {
  setTimeout(() => (e.target.style.display = "block"), 0);
  draggedWord = null;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add("drag-over");
}

function dragLeave() {
  this.classList.remove("drag-over");
}

function dragDrop() {
  this.classList.remove("drag-over");

  const wordText = draggedWord.innerText;
  const correctWord = this.getAttribute("data-word");

  if (wordText === correctWord) {
    this.innerText = wordText; // Move the word to the definition box
    draggedWord.classList.add("matched"); // Mark word as matched
    draggedWord.setAttribute("draggable", false); // Make word un-draggable
  }
}

// Mobile touch events
function touchStart(e) {
  touchWord = e.target;
  e.preventDefault();
}

function touchMove(e) {
  e.preventDefault();
  const touchLocation = e.touches[0];
  touchWord.style.position = "absolute";
  touchWord.style.left = touchLocation.pageX + "px";
  touchWord.style.top = touchLocation.pageY + "px";
}

function touchEnd(e) {
  e.preventDefault();
  touchWord = null;
}

function touchOver(e) {
  e.preventDefault();
}

function touchEnter(e) {
  e.preventDefault();
  this.classList.add("drag-over");
}

function touchDrop(e) {
  e.preventDefault();
  this.classList.remove("drag-over");

  const wordText = touchWord.innerText;
  const correctWord = this.getAttribute("data-word");

  if (wordText === correctWord) {
    this.innerText = wordText;
    touchWord.classList.add("matched");
    touchWord.setAttribute("draggable", false);
    touchWord.style.display = "none"; // Hide the matched word
  }
}
