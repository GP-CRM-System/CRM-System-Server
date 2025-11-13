import type { NextFunction, Request, Response } from "express";
import {
  generateToken,
  verifyRefreshToken,
  verifyToken
} from "../services/auth.service.js";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = verifyToken(req.cookies.token);
  const refreshToken = verifyRefreshToken(req.cookies.refreshToken);

  if (token && refreshToken) {
    next();
  }

  if (!token && refreshToken) {
    const newToken = generateToken({
      // @ts-expect-error bad type
      _id: refreshToken._id,
      // @ts-expect-error bad type
      email: refreshToken.email,
      // @ts-expect-error bad type
      role: refreshToken.role
    });
    res.cookie("token", newToken, { httpOnly: true });
    next();
  }

  if (!token && !refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
}
