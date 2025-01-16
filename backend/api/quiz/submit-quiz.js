import express from "express";
import { verifyToken } from "../../utils/verifyToken.js";
import User from "../../models/User.js";
import QuizResult from "../../models/QuizResult.js";
import { Op } from "sequelize"; // Import sequelize Op

const router = express.Router();

// Endpoint to submit quiz score
router.post("/", verifyToken, async (req, res) => {
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
    let addedXp = score * 10;

    if (score >= passingScore && user.level < 5 && user.level == quizId) {
      updatedLevel = parseInt(user.level, 10) + 1; // Ubah level menjadi angka sebelum menambahkan 1
      await User.update(
        { level: updatedLevel, xp: user.xp + addedXp },
        { where: { user_id: userId } }
      );
      
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
    } else {
      console.error("Error: Invalid quiz result submission");
      return res.status(400).json({ message: "Invalid quiz result submission" });
    }

    res.status(200).json({
      message: "Quiz result submitted successfully",
      newLevel: updatedLevel,
      score,
      xp: user.xp + addedXp,
    });
  } catch (error) {
    console.error("Error during quiz result submission:", error);
    res.status(500).json({ message: "An error occurred while submitting the quiz result." });
  }
});

export default router;
