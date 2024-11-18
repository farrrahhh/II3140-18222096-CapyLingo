import express from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User.js"; // Model User untuk mengakses database
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  // Validasi input
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Cek apakah user ada di database
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verifikasi oldPassword dengan password di database
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "An error occurred while changing the password. Please try again." });
  }
});

export default router;
