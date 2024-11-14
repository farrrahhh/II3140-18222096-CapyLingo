// models/Question.js
import { DataTypes } from "sequelize";
import db from "../config.js";
import Quiz from "./Quiz.js";

const Question = db.define(
  "Question",
  {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Quiz,
        key: "quiz_id",
      },
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_c: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_d: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correct_option: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

Quiz.hasMany(Question, { foreignKey: "quiz_id" });
Question.belongsTo(Quiz, { foreignKey: "quiz_id" });

export default Question;
