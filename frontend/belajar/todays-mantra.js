// Daftar mantra yang akan dirandom
const mantras = ["Believe in yourself and all that you are.", "Mistakes are proof that you are trying.", "Learning never exhausts the mind.", "Every day is a chance to grow.", "Embrace the journey, not just the destination."];

// Fungsi untuk merandom dan menampilkan mantra
function getRandomMantra() {
  const randomIndex = Math.floor(Math.random() * mantras.length);
  return mantras[randomIndex];
}

// Menampilkan mantra saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("todays-mantra").innerText = getRandomMantra();
});
