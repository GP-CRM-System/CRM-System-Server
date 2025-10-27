import rateLimit from "express-rate-limit";
import { rateLimiter } from "../controllers/misc.controller.js";

export const authRateLimit = rateLimit({
  windowMs: 60000,
  limit: 25,
  handler: rateLimiter,
  standardHeaders: true,
  legacyHeaders: false
});
