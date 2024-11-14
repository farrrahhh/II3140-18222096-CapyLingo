import express from "express";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import cors from "cors";
import User from "./models/User.js";
import Quiz from "./models/Quiz.js"; // Import the Quiz model
import Question from "./models/Question.js"; // Import the Question model
import QuizResult from "./models/QuizResult.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "./config.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const SECRET_KEY = process.env.SECRET_KEY; // Load the secret key from environment variables

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.level = decoded.level;
    next();
  });
};

// Check database connection
try {
  await db.authenticate();
  console.log("Database Connected...");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Endpoint for Sign Up
app.post("/signup", async (req, res) => {
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
      level: newUser.level, // Send the level
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "An error occurred while signing up. Please try again." });
  }
});

// Endpoint to submit quiz score
app.post("/submit-quiz", verifyToken, async (req, res) => {
  const { userId, quizId, score, totalQuestions } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(400).json({ message: "User not found" });
    }

    const quizresult = await QuizResult.findOne({ where: { [Op.and]: [{ user_id: userId }, { quiz_id: quizId }] } });
    const passingScore = 2;
    let updatedLevel = user.level;

    if (score >= passingScore && user.level < 5 && user.level == quizId) {
      updatedLevel = user.level + 1;
      await User.update({ level: updatedLevel }, { where: { user_id: userId } });

      // Save the quiz result if it's the user's first attempt
      if (!quizresult) {
        await QuizResult.create({
          user_id: userId,
          quiz_id: quizId,
          score: score,
        });
      }
    } else if (score >= passingScore && user.level == 5) {
      // Save the quiz result if the user is at max level and has passed the quiz
      if (!quizresult) {
        await QuizResult.create({
          user_id: userId,
          quiz_id: quizId,
          score: score,
        });
      }
    } else if (quizresult && score > quizresult.score) {
      // Update the quiz result if the new score is higher than the previous one
      await QuizResult.update({ score: score }, { where: { [Op.and]: [{ user_id: userId }, { quiz_id: quizId }] } });
    } else if (score < passingScore) {
      // Return if the score is below the passing threshold
      return res.status(400).json({ message: "Score is less than passing score" });
    } else if (quizresult && score <= quizresult.score) {
      // Do nothing if there is an existing quiz result with a score higher or equal to the new score
      console.log("Score is not higher than previous attempt, no update performed.");
    }

    res.status(200).json({
      message: "Quiz result submitted successfully",
      newLevel: updatedLevel,
      score,
    });
  } catch (error) {
    console.error("Error during quiz result submission:", error);
    res.status(500).json({ message: "An error occurred while submitting the quiz result." });
  }
});

// Endpoint for Login
app.post("/login", async (req, res) => {
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

    // Login successful, send token
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
});

// Endpoint to fetch quizzes and questions based on level (protected)
app.get("/quizzes", verifyToken, async (req, res) => {
  const { level } = req.query;

  try {
    const quiz = await Quiz.findOne({
      where: { quiz_id: level },
      include: [{ model: Question, as: "Questions" }],
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "An error occurred while fetching the quiz." });
  }
});

// Endpoint to verify JWT token
app.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error(`Server error: ${error}`);
  }
});
