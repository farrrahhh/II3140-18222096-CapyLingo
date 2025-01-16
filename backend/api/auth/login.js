import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Periksa password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, level: user.level },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Perhitungan day streak
    const today = new Date();
    const lastLogin = user.last_login ? new Date(user.last_login) : null;

    if (lastLogin) {
      // Bandingkan tanggal dengan format `YYYY-MM-DD`
      const todayDate = today.toISOString().split("T")[0];
      const lastLoginDate = lastLogin.toISOString().split("T")[0];

      if (todayDate !== lastLoginDate) {
        // Jika login berturut-turut
        if (new Date(todayDate) - new Date(lastLoginDate) === 86400000) {
          user.day_streak += 1; // Tambah streak
        } else {
          user.day_streak = 1; // Reset streak
        }
      }
    } else {
      // Pertama kali login
      user.day_streak = 1;
    }

    // Perbarui last_login
    user.last_login = today;

    // Simpan perubahan ke database
    await user.save();

    // Kirim respons
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.user_id,
      username: user.username,
      level: user.level,
      xp: user.xp,
      day_streak: user.day_streak,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      message: "An error occurred while logging in. Please try again.",
      error: error.message,
    });
  }
});

export default router;