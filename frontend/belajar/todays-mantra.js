// Daftar mantra yang akan dirandom
const mantras = [
  "Believe in yourself and all that you are; within you is the power to achieve greatness.",
  "Mistakes are proof that you are trying; every stumble is a step forward.",
  "Learning never exhausts the mind; embrace knowledge as the foundation of success.",
  "Every day is a chance to grow; seize the moment and let your spirit thrive.",
  "Embrace the journey, not just the destination; growth happens along the way.",
  "Your dreams are valid, and every small step is bringing you closer.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Challenges are what make life interesting; overcoming them is what makes life meaningful.",
  "A positive attitude gives you power over your circumstances.",
  "Your only limit is your mind; think big and dare to dream.",
  "Progress, not perfection, is the goal; celebrate every victory along the way.",
  "You are capable of amazing things; believe it, and make it happen.",
  "Your potential is endless; push through the fear and embrace change.",
  "Small steps can lead to great things; keep moving forward.",
  "Find strength in knowing you can rise above any challenge.",
];

// Fungsi untuk merandom dan menampilkan mantra
function getRandomMantra() {
  const randomIndex = Math.floor(Math.random() * mantras.length);
  return mantras[randomIndex];
}

// Menampilkan mantra saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("todays-mantra").innerText = getRandomMantra();
});
