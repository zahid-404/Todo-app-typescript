import jwt from "jsonwebtoken";
export const SECRET = "SECr3t"; // This should be in an environment variable in a real application
import { Request, Response, NextFunction } from "express";

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
