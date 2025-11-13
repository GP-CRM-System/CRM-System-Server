import express from "express";
import { healthCheck } from "../controllers/misc.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const miscRouter = express.Router();

miscRouter.get("/health", isAuthenticated, healthCheck);

export default miscRouter;
