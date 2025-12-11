import bcrypt  from 'bcrypt';
import type { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import type { IResponse } from "../interfaces/response.interface.js";
import Employee from "../models/employee.model.js";
import z from 'zod';

export async function getProfile(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        const id = req.params.id;
        const profile = await Employee.findById(id).populate("role").select("-password");
        if (!profile) {
            res.status(404).json({
                message: "Error retrieving profile",
                error: "Profile not found"
            });
            logger.warn(`Profile ${id} not found`);
            return;
        }
        logger.info(`Retrieved Profile ${profile.fullName}`);
        res.status(200).json({
            message: "Profile retrieved", data: {
                profile,

            }
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error retrieving profile: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function updateProfile(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        const id = req.params.id;
        const { fullName, email, phone } = req.body;
        const profile = await Employee.findByIdAndUpdate(id, { fullName, email, phone }, { new: true }).populate("role").select("-password");
        if (!profile) {
            res.status(404).json({
                message: "Error updating profile",
                error: "Profile not found"
            });
            logger.warn(`Profile ${id} not found`);
            return;
        }
        logger.info(`Updated Profile ${profile.fullName}`);
        res.status(200).json({
            message: "Profile updated", data: profile
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error updating profile: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function changePassword(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        const id = req.params.id;
        const { password } = req.body;

        const { success, error } = z
            .string("Password is required")
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password must be at most 64 characters long")
            .nullable()
            .safeParse(password);
        
        if (!success) {
            res.status(400).json({
                message: "Error updating profile",
                error: error.message
            });
            logger.warn(`Profile ${id} password change failed`);
            return;
        }

        const profile = await Employee.findById(id).populate("role");
        if (!profile) {
            res.status(404).json({
                message: "Error updating profile",
                error: "Profile not found"
            });
            logger.warn(`Profile ${id} not found for password change`);
            return;
        }

        if(!profile.password){
            res.status(400).json({
                message: "Error updating profile",
                error: "Password is required"
            });
            logger.warn(`Profile ${id} password change failed`);
            return;
        }

        const isValid = bcrypt.compareSync(password, profile.password);
        if (!isValid) {
            res.status(400).json({
                message: "Error updating profile",
                error: "Invalid password"
            });
            logger.warn(`Profile ${id} password change failed`);
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        profile.password = hashedPassword;
        await profile.save();


        logger.info(`Password changed for Profile ${profile.fullName}`);
        res.status(200).json({
            message: "Password changed", data: profile
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error updating profile: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}