const words = document.querySelectorAll(".word");
const definitions = document.querySelectorAll(".definition");

words.forEach((word) => {
  word.addEventListener("dragstart", dragStart);
  word.addEventListener("dragend", dragEnd);
});

definitions.forEach((definition) => {
  definition.addEventListener("dragover", dragOver);
  definition.addEventListener("dragenter", dragEnter);
  definition.addEventListener("dragleave", dragLeave);
  definition.addEventListener("drop", dragDrop);
});

let draggedWord = null;

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
