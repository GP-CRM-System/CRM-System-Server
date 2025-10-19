import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 60000,
  limit: 25,
  handler: (_req: Request, res: Response) => {
    return res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
  },
  standardHeaders: true,
  legacyHeaders: false
});
