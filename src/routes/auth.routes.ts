import express from "express";
import {
  login,
  registerAdmin,
  googleCallback
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

export default authRouter;
