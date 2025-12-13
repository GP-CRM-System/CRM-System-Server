import express from "express";
import {
    changePassword,
    getProfile,
    updateProfile
} from "../controllers/profile.controller.js";

const profileRouter = express.Router();

profileRouter.route("/").get(getProfile).put(updateProfile);
profileRouter.post("/password", changePassword);

export default profileRouter;
