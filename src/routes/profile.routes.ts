import express from "express";
import {
    changePassword,
    getProfile,
    updateProfile
} from "../controllers/profile.controller.js";

const profileRouter = express.Router();

profileRouter.route("/:id").get(getProfile).put(updateProfile);
profileRouter.post("/:id/password", changePassword);

export default profileRouter;
