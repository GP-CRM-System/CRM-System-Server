import express from "express";
import { login, registerAdmin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.route("/register").post(registerAdmin);
authRouter.route("/login").post(login);
export default authRouter;
