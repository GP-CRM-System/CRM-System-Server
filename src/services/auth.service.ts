import jwt from "jsonwebtoken";
import type mongoose from "mongoose";
import { logger } from "../config/logger.config.js";
import Role from "../models/role.model.js";
import type { IRole } from "../interfaces/role.interface.js";
import bcrypt from "bcrypt";
import Employee from "../models/employee.model.js";

export function generateToken(emp: {
    _id: mongoose.Types.ObjectId;
    email: string;
    role: IRole;
}) {
    const payload = { _id: emp._id, email: emp.email, role: emp.role };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1h"
    });
}

export function generateRefreshToken(emp: {
    _id: mongoose.Types.ObjectId;
    email: string;
    role: IRole;
}) {
    const payload = { _id: emp._id, email: emp.email, role: emp.role };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: "7d"
    });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error: unknown) {
        logger.error(`Token verification failed: ${(error as Error).message}`);
        return null;
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    } catch (error: unknown) {
        logger.error(
            `Refresh token verification failed: ${(error as Error).message}`
        );
        return null;
    }
}

export async function createRootRole(): Promise<string | null> {
    try {
        const existingRole = await Role.findOne({ name: "root" });
        if (existingRole) {
            logger.info("Root role already exists");
            return existingRole._id.toString();
        }

        const role = new Role({
            name: "root",
            isActive: true,
            Company: {
                read: true,
                write: true,
                delete: true
            },
            Employee: {
                read: true,
                write: true,
                delete: true
            },
            Contact: {
                read: true,
                write: true,
                delete: true
            },
            Deal: {
                read: true,
                write: true,
                delete: true
            },
            Role: {
                read: true,
                write: true,
                delete: true
            },
            Order: {
                read: true,
                write: true,
                delete: true
            },
            Ticket: {
                read: true,
                write: true,
                delete: true
            }
        });

        await role.save();
        return role._id.toString();
    } catch (error: unknown) {
        logger.error(`Error creating root role: ${(error as Error).message}`);
        return null;
    }
}

export async function changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
): Promise<{ success: boolean; message: string }> {
    try {
        const employee = await Employee.findById(userId);
        if (!employee) {
            return { success: false, message: "Employee not found" };
        }

        if (!employee.password) {
            return {
                success: false,
                message: "User password not set (social login?)"
            };
        }

        const isMatch = await bcrypt.compare(oldPassword, employee.password);
        if (!isMatch) {
            return { success: false, message: "Invalid old password" };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Employee.findByIdAndUpdate(userId, { password: hashedPassword });

        return { success: true, message: "Password updated successfully" };
    } catch (error: unknown) {
        logger.error(`Error changing password: ${(error as Error).message}`);
        return { success: false, message: "Internal server error" };
    }
}
