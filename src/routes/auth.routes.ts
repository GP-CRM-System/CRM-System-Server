import express from "express";
import { login, registerAdmin, test } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.route("/register").post(registerAdmin);
authRouter.route("/login").post(login);
authRouter.get("/test", test);
export default authRouter;
