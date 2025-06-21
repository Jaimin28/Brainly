import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  // Check for presence of token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token missing or malformed" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Attach user ID to request (assumes token payload has `id`)
    (req as any).userId = decoded.id;

    next(); // ✅ Allow route to continue
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
