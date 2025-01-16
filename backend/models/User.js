import { DataTypes } from "sequelize";
import db from "../config.js";

const User = db.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    day_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
      defaultValue: null, // Menyimpan tanggal login terakhir
    },
  },
  {
    timestamps: true, // Buat kolom created_at secara otomatis
    createdAt: "created_at",
    updatedAt: false, // Nonaktifkan kolom updated_at
  }
);

export default User;