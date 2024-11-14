import express from "express";
import { signUp, login, verifyToken } from "../controllers/userController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js"; // Middleware untuk verifikasi token

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/verify-token", verifyTokenMiddleware, verifyToken);

export default router;
