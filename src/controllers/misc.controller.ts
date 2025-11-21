import type { Request, Response } from "express";
import { verifyToken } from "../services/auth.service.js";

export function rateLimiter(_req: Request, res: Response) {
  return res
    .status(429)
    .json({ message: "Too many requests, please try again later." });
}

export function healthCheck(_req: Request, res: Response) {
  return res.status(200).json({ status: "OK", timestamp: new Date() });
}

export function notFound(_req: Request, res: Response) {
  return res.status(404).json({ message: "Resource not found." });
}

export function whoami(req: Request, res: Response) {
  const token = verifyToken(req.cookies.token);
  if (token) {
    return res.status(200).json({ message: "You are logged in", user: token });
  }
  return res.status(401).json({ message: "You are not logged in" });
}
