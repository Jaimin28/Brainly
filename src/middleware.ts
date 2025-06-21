import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token missing or malformed" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    
    (req as any).userId = decoded.id;

    next(); 
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
