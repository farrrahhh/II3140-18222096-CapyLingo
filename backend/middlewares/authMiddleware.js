import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const SECRET_KEY = process.env.SECRET_KEY; // Secret key for JWT

// Middleware to verify JWT
const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.level = decoded.level;
    next();
  });
};

export default verifyTokenMiddleware;
