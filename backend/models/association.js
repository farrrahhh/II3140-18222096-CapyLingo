// models/associations.js
import User from "./User.js";
import Quiz from "./Quiz.js";
import QuizResult from "./QuizResult.js";
import Question from "./Question.js";

// Relasi antara User dan QuizResult (One-to-Many)
User.hasMany(QuizResult, { foreignKey: "user_id" });
QuizResult.belongsTo(User, { foreignKey: "user_id" });

// Relasi antara Quiz dan QuizResult (One-to-Many)
Quiz.hasMany(QuizResult, { foreignKey: "quiz_id" });
QuizResult.belongsTo(Quiz, { foreignKey: "quiz_id" });

// Relasi antara Quiz dan Question (One-to-Many)
Quiz.hasMany(Question, { foreignKey: "quiz_id" });
Question.belongsTo(Quiz, { foreignKey: "quiz_id" });
