//backend/api/verifyToken.js
import express from "express";
import { verifyToken } from "../utils/verifyToken.js"; // Pastikan verifyToken diimpor dengan benar

const router = express.Router();

// Endpoint untuk memverifikasi JWT token
router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

export default router;
