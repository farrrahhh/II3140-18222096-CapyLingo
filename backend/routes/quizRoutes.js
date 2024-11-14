import express from "express";
import { submitQuiz, getQuizzes } from "../controllers/quizController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/submit-quiz", verifyToken, submitQuiz);
router.get("/quizzes", verifyToken, getQuizzes);

export default router;
