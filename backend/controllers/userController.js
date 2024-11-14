import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Sign up function
export const signUp = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required." });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user with default level
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
};

// Login function
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.user_id, username: user.username, level: user.level }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.user_id,
      username: user.username,
      level: user.level,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred while logging in. Please try again." });
  }
};

// Verify token function
export const verifyToken = (req, res) => {
  res.status(200).json({ message: "Token is valid" });
};
