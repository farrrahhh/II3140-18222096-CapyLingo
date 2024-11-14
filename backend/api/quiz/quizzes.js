//backend/api/quiz/quizzes.js

import express from "express";
import { verifyToken } from "../../utils/verifyToken.js";
import Quiz from "../../models/Quiz.js";
import Question from "../../models/Question.js";

const router = express.Router();

// Endpoint to fetch quizzes and questions based on level (protected)
router.get("/", verifyToken, async (req, res) => {
  const { level } = req.query;

  try {
    const quiz = await Quiz.findOne({
      where: { quiz_id: level },
      include: [{ model: Question, as: "Questions" }],
    });
    console.log("Quiz:", quiz); // Log data quiz yang ditemukan

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error); // Log lebih detail
    res.status(500).json({ message: "An error occurred while fetching the quiz.", error: error.message });
  }
});

export default router;
