import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Test database connection
try {
  await db.authenticate();
  console.log("Database connected...");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Routes
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);

export default app;
