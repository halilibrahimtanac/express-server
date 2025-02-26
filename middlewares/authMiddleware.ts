import { Request, Response, NextFunction } from "express";
import JWTService from "../services/JWTService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export default async function authorize(  // Make the function async
  req: Request,
  res: Response,
  next: NextFunction
) {
  const routePath = req.path;
  const refreshToken = req.cookies.refreshToken;
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

    // Check if token exists in database
    const tokenExists = await prisma.token.findFirst({
      where: {
        userId: decoded.id,
        token: token
      }
    });

    if (!tokenExists) {
      res.status(401).json({ error: "Token has been invalidated" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    await prisma.token.deleteMany({
      where: {
        ...routePath === "/logout" ? { OR: [{ token }, { token: refreshToken }]} : { token },
      }
    });
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}