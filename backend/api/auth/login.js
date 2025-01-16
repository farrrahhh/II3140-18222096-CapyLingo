//backend/api/auth/login.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
//impor dot env
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.user_id, username: user.username, level: user.level }, process.env.SECRET_KEY, { expiresIn: "1h" });
    // day streak
    const today = new Date();
    const lastLogin = new Date(user.last_login);
    const dayStreak = user.day_streak;
    if (today.getDate() !== lastLogin.getDate()) {
      if (today.getDate() - lastLogin.getDate() === 1) {
        user.day_streak = dayStreak + 1;
      } else {
        user.day_streak = 1;
      }
    }                         

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
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred while logging in. Please try again." });
  }
});

export default router;
