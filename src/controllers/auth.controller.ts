import type { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import type { IResponse } from "../interfaces/response.interface.js";
import { SEmployee, type IEmployee } from "../interfaces/employee.interface.js";
import Employee from "../models/employee.model.js";
import {
    createRootRole,
    generateRefreshToken,
    generateToken,
    changePassword as changePasswordService
} from "../services/auth.service.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Role from "../models/role.model.js";
import { emailTemplates, sendEmail } from "../config/mail.config.js";
import type { IRole } from "../interfaces/role.interface.js";
import { z } from "zod";
import crypto from "crypto";

export async function registerAdmin(
    req: Request<object, object, IEmployee>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const employee = await SEmployee.partial().safeParseAsync(req.body);

        if (employee.success === false) {
            res.status(400).json({
                message: "Invalid admin payload",
                error: JSON.parse(employee.error.message)
            });
            logger.error("Invalid admin payload");
            return;
        }

        const existingAdmin = await Employee.findOne({
            email: employee.data.email
        });
        if (existingAdmin) {
            res.status(409).json({
                message: "Admin creation failed",
                error: "Admin with the same email already exists"
            });
            logger.error(`Admin ${employee.data.email} already exists`);
            return;
        }

        const roleId = await createRootRole();
        if (!roleId) {
            res.status(500).json({
                message: "Admin creation failed",
                error: "Failed to create root role"
            });
            logger.error("Failed to create root role");
            return;
        }

        employee.data.role = new mongoose.Types.ObjectId(roleId);
        employee.data.password = bcrypt.hashSync(employee.data.password!, 10);

        logger.info(`Created admin ${employee.data.email}`);
        const createdAdmin = await Employee.create(employee.data);
        const rootRole = await Role.findById(roleId);

        const token = generateToken({
            _id: createdAdmin._id,
            email: createdAdmin.email,
            role: rootRole!
        });

        const refreshToken = await generateRefreshToken({
            _id: createdAdmin._id,
            email: createdAdmin.email,
            role: rootRole!
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        await sendEmail(
            createdAdmin.email,
            emailTemplates.welcome(createdAdmin.fullName || "Admin").subject,
            emailTemplates.welcome(createdAdmin.fullName || "Admin").html
        );

        res.status(201).json({
            message: "Admin created",
            data: {
                token,
                refreshToken,
                user: await createdAdmin.populate("role")
            }
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error registering admin: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function login(
    req: Request<object, object, Partial<IEmployee>>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const employee = await SEmployee.partial().safeParseAsync(req.body);

        if (employee.success === false) {
            res.status(400).json({
                message: "Invalid employee payload",
                error: JSON.parse(employee.error.message)
            });
            logger.error("Invalid employee payload");
            return;
        }

        const existingEmployee = await Employee.findOne({
            email: employee.data.email
        }).populate("role");
        if (!existingEmployee) {
            res.status(404).json({
                message: "Login failed",
                error: "Employee not found"
            });
            logger.warn(`Employee ${employee.data.email} not found`);
            return;
        }

        if (
            !bcrypt.compareSync(
                employee.data.password!,
                existingEmployee.password!
            )
        ) {
            res.status(401).json({
                message: "Login failed",
                error: "Invalid credentials"
            });
            logger.warn(
                `Invalid credentials for employee ${employee.data.email}`
            );
            return;
        }

        const token = generateToken({
            _id: existingEmployee._id,
            email: existingEmployee.email,
            // @ts-expect-error role is populated
            role: existingEmployee.role
        });
        const refreshToken = generateRefreshToken({
            _id: existingEmployee._id,
            email: existingEmployee.email,
            // @ts-expect-error role is populated
            role: existingEmployee.role
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            message: "Employee logged in",
            data: {
                token,
                refreshToken,
                user: existingEmployee
            }
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error logging in: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function logout(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.status(200).json({
            message: "Employee logged out successfully",
            data: null
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error logging out: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function googleCallback(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        if (!req.user) {
            logger.error("No user data from Google while logging in");
            res.status(401).json({
                message: "Login failed",
                error: "No user data from Google while logging in"
            });
            return;
        }

        const emp = req.user as IEmployee & {
            _id: mongoose.Types.ObjectId;
            role: IRole;
        };

        // Generate JWT
        const token = generateToken({
            _id: emp._id,
            email: emp.email,
            role: emp.role
        });

        const refreshToken = generateRefreshToken({
            _id: emp._id,
            email: emp.email,
            role: emp.role
        });

        res.status(200).json({
            message: "Google authentication successful",
            data: {
                token,
                refreshToken,
                emp
            }
        });
        logger.info(`User logged in via Google: ${emp.email}`);
        return;
    } catch (error: unknown) {
        logger.error(`Google OAuth error: ${error}`);
        res.status(500).json({
            message: "Internal server error",
            error: (error as Error).message
        });
        return;
    }
}

export async function forgotPassword(
    req: Request<object, object, { email: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const email = z
            .email("Email is should be valid")
            .safeParse(req.body.email);

        if (email.success === false) {
            res.status(400).json({
                message: "Password Reset failed",
                error: JSON.parse(email.error.message)
            });
            logger.error("Invalid email");
            return;
        }

        const existingEmployee = await Employee.findOne({
            email: email.data
        });

        if (!existingEmployee) {
            res.status(200).json({
                message: "Password Reset sucessful",
                data: "if employee exists, an email should be sent"
            });
            logger.error(`Employee ${email.data} not found`);
            return;
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        await existingEmployee.updateOne({
            resetToken: resetTokenHash,
            resetExpire: Date.now() + 3600000 * 24 // 24 hours
        });

        const appUrl = process.env.APP_URL || "http://localhost:5173";
        const resetLink = `${appUrl}/verify-reset?token=${resetToken}`;

        await sendEmail(
            email.data,
            emailTemplates.forgotPassword(
                existingEmployee.fullName || "User",
                resetLink
            ).subject,
            emailTemplates.forgotPassword(
                existingEmployee.fullName || "User",
                resetLink
            ).html
        );

        res.status(200).json({
            message: "Password Reset successful",
            data: "If an account with that email exists, a password reset link has been sent."
        });
        logger.info(`Password reset email sent to ${email.data}`);
        return;
    } catch (error: unknown) {
        logger.error(`Error forgot password: ${(error as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (error as Error).message
        });
        return;
    }
}

export async function resetPassword(
    req: Request<
        object,
        object,
        { password: string; token: string; confirmPassword: string }
    >,
    res: Response<IResponse>
): Promise<void> {
    try {
        const { token, password: newPassword, confirmPassword } = req.body;

        if (!token) {
            res.status(400).json({
                message: "Password Reset failed",
                error: "Reset token is required"
            });
            return;
        }
        const passwordValidation = z
            .string("Password is required")
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password must be at most 64 characters long")
            .safeParse(newPassword);

        if (passwordValidation.success === false) {
            res.status(400).json({
                message: "Password Reset failed",
                error: JSON.parse(passwordValidation.error.message)
            });
            logger.error("Invalid new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({
                message: "Password Reset failed",
                error: "New password and confirmation do not match"
            });
            logger.error("New password and confirmation do not match");
            return;
        }

        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const existingEmployee = await Employee.findOne({
            resetToken: resetTokenHash,
            resetExpire: { $gt: Date.now() }
        });

        if (!existingEmployee) {
            res.status(400).json({
                message: "Password Reset failed",
                error: "Invalid or expired reset token"
            });
            logger.error(`Invalid or expired reset token attempt`);
            return;
        }

        await existingEmployee.updateOne({
            password: bcrypt.hashSync(passwordValidation.data, 10),
            resetToken: null,
            resetExpire: null
        });

        res.status(200).json({
            message: "Password Reset sucessful",
            data: "Password reset successfully"
        });
        logger.info(`Password reset for employee ${existingEmployee._id}`);
        return;
    } catch (error: unknown) {
        logger.error(`Error reset password: ${(error as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (error as Error).message
        });
        return;
    }
}

export async function verifyResetToken(
    req: Request<{ token: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const { token } = req.params;

        if (!token) {
            res.status(400).json({
                message: "Verification failed",
                error: "Token is required"
            });
            return;
        }

        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const existingEmployee = await Employee.findOne({
            resetToken: resetTokenHash,
            resetExpire: { $gt: Date.now() }
        });

        if (!existingEmployee) {
            res.status(400).json({
                message: "Verification failed",
                error: "Invalid or expired reset token"
            });
            return;
        }

        res.status(200).json({
            message: "Token verified",
            data: {
                email: existingEmployee.email,
                fullName: existingEmployee.fullName
            }
        });
        return;
    } catch (error: unknown) {
        logger.error(`Error verifying reset token: ${(error as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (error as Error).message
        });
        return;
    }
}

export async function changePassword(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            res.status(400).json({
                message: "Change password failed",
                error: "All fields (oldPassword, newPassword, confirmPassword) are required"
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({
                message: "Change password failed",
                error: "New password and confirm password do not match"
            });
            return;
        }

        const passwordValidation = z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password must be at most 64 characters long")
            .safeParse(newPassword);

        if (passwordValidation.success === false) {
            res.status(400).json({
                message: "Change password failed",
                error: JSON.parse(passwordValidation.error.message)
            });
            return;
        }

        const userId = (req.user as any)?._id;
        if (!userId) {
            res.status(401).json({
                message: "Change password failed",
                error: "User not authenticated"
            });
            return;
        }

        const result = await changePasswordService(
            userId,
            oldPassword,
            newPassword
        );

        if (!result.success) {
            res.status(400).json({
                message: "Change password failed",
                error: result.message
            });
            return;
        }

        res.status(200).json({
            message: "Password changed successfully",
            data: null
        });
        logger.info(`Password changed for user ${userId}`);
        return;
    } catch (error: unknown) {
        logger.error(
            `Error in changePassword controller: ${(error as Error).message}`
        );
        res.status(500).json({
            message: "Internal server error",
            error: (error as Error).message
        });
        return;
    }
}

