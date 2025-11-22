import express from "express";
import { login, registerAdmin, googleCallback } from "../controllers/auth.controller.js";
import passport from "passport";

const authRouter = express.Router();

authRouter.route("/register").post(registerAdmin);
authRouter.route("/login").post(login);
authRouter.route("/google").get(passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
authRouter.route("/google/callback").get(passport.authenticate('google', { session: false }), googleCallback);
export default authRouter;
