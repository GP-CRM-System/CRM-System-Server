import { Request, Response, NextFunction } from "express";


export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.session.userId) {
    next();
    return;
  } else {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
}

export function isNotAuthenticated
  (req: Request,
    res: Response,
    next: NextFunction
  ): void {
  if (!req.session.userId) {
    next();
    return;
  }
  res.status(401).json({ message: "you are already logged in" });
  return;
}