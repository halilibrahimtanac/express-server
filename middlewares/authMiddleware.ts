import { Request, Response, NextFunction } from "express";
import JWTService from "../services/JWTService";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export default function authorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ error: "Invalid Authorization header format" });
    return;
  }

  const token = parts[1];
  if (!token) {
    res.status(401).json({ error: "Token missing" });
    return;
  }

  try {
    const jwtService = JWTService.getInstance();
    const decoded = jwtService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}