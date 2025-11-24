import express from "express";
import {
  login,
  registerAdmin,
  googleCallback,
  forgotPassword,
  resetPassword,
  logout
} from "../controllers/auth.controller.js";
import passport from "passport";

const authRouter = express.Router();

authRouter.post("/register", registerAdmin);
authRouter.post("/login", login);
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password/:id", resetPassword)
authRouter.get("/logout", logout)

export default authRouter;
