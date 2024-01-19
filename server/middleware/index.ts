import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();
export const SECRET = process.env.SECRET || "fallback-secret";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, payload) => {
    if (err || !payload || typeof payload === "string") {
      return res.sendStatus(403);
    }

    req.headers["userId"] = payload.id;
    next();
  });
};
