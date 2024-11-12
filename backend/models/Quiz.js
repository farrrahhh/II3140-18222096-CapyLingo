// models/Quiz.js
import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Quiz = db.define(
  "Quiz",
  {
    quiz_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Quiz;
