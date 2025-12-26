import express from "express";
import {
    login,
    registerAdmin,
    googleCallback,
    forgotPassword,
    resetPassword,
    logout,
    verifyResetToken,
    changePassword
} from "../controllers/auth.controller.js";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerAdmin);
authRouter.post("/login", login);
authRouter.post("/change-password", isAuthenticated, changePassword);
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

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/verify-reset-token/:token", verifyResetToken);
authRouter.get("/logout", logout);

export default authRouter;
