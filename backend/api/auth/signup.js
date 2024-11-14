//backend/api/auth/signup.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User.js"; // Pastikan model User sudah benar

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required." });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      level: 1, // Default level
    });

    res.status(201).json({
      message: "Sign up successful",
      userId: newUser.user_id,
      username: newUser.username,
      level: newUser.level,
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "An error occurred while signing up. Please try again." });
  }
});

export default router;
