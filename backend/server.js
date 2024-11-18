import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import rute API
import submitQuizRoute from "./api/quiz/submit-quiz.js";
import quizzesRoute from "./api/quiz/quizzes.js";
import verifyTokenRoute from "./api/verifyToken.js"; // Rute untuk verifikasi token
import signupRoute from "./api/auth/signup.js"; // Rute untuk signup
import loginRoute from "./api/auth/login.js"; // Rute untuk login
import changePasswordRoute from "./api/auth/changepassword.js"; // Rute untuk mengganti password

import db from "./config.js"; // Pastikan config.js mengatur koneksi db

dotenv.config(); // Memuat konfigurasi .env sebelum menggunakan variabel lingkungan

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Untuk parse body JSON

// Rute API
app.use("/api/submit-quiz", submitQuizRoute);
app.use("/api/quizzes", quizzesRoute);
app.use("/api/verify-token", verifyTokenRoute); // Rute untuk verifikasi token
app.use("/api/signup", signupRoute); // Rute untuk signup
app.use("/api/login", loginRoute); // Rute untuk login
app.use("/api/change-password", changePasswordRoute); // Rute untuk mengganti password

// Endpoint untuk root atau home (opsional)
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz API");
});

// Fungsi untuk memulai server dan koneksi database
const startServer = async () => {
  try {
    // Cek koneksi ke database
    await db.authenticate();
    console.log("Database Connected...");

    // Menjalankan server setelah koneksi ke DB berhasil
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Mulai server dan database
startServer();
