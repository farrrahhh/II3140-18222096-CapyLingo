import express from "express";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import cors from "cors";
import db from "./config/Database.js";
import User from "./models/User.js";
import Quiz from "./models/Quiz.js"; // Import the Quiz model
import Question from "./models/Question.js"; // Import the Question model

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Check database connection
try {
  await db.authenticate();
  console.log("Database Connected...");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Endpoint for Sign Up
app.post("/api/signup", async (req, res) => {
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
app.post("/api/submit-quiz", async (req, res) => {
  const { userId, score, totalQuestions } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(400).json({ message: "User not found" });
    }

    const passingScore = 1;
    if (score >= passingScore) {
      const updatedLevel = user.level + 1;
      const [updated] = await User.update({ level: updatedLevel }, { where: { user_id: userId } });

      if (updated) {
        console.log(`User level updated successfully for user ID ${userId}`);
        res.status(200).json({
          message: "Quiz result submitted successfully",
          newLevel: updatedLevel,
          score,
        });
      } else {
        console.error(`Failed to update user level for user ID ${userId}`);
        res.status(500).json({ message: "Failed to update user level" });
      }
    } else {
      res.status(200).json({
        message: "Quiz result submitted, but level not increased",
        score,
      });
    }
  } catch (error) {
    console.error("Error during quiz result submission:", error);
    res.status(500).json({ message: "An error occurred while submitting the quiz result." });
  }
});

// Endpoint for Login
app.post("/api/login", async (req, res) => {
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

    // Login successful, send user data (user_id, username, level)
    res.status(200).json({
      message: "Login successful",
      userId: user.user_id,
      username: user.username,
      level: user.level, // Send the level
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred while logging in. Please try again." });
  }
});

// Endpoint to fetch quizzes and questions based on level
app.get("/api/quizzes", async (req, res) => {
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

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
