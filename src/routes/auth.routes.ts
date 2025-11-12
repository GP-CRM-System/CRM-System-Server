import express from "express";
import { registerAdmin, testTokens } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.route("/register").post(registerAdmin);
authRouter.get("/test", testTokens);

export default authRouter;
