import type { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import type { IResponse } from "../interfaces/response.interface.js";
import { SEmployee, type IEmployee } from "../interfaces/employee.interface.js";
import Employee from "../models/employee.model.js";
import {
  createRootRole,
  generateRefreshToken,
  generateToken
} from "../services/auth.service.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Role from "../models/role.model.js";
import { emailTemplates, sendEmail } from "../config/mail.config.js";
import type { IRole } from "../interfaces/role.interface.js";

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
      res
        .status(409)
        .json({
          message: "Admin creation failed",
          error: "Admin with the same email already exists"
        });
      logger.error(`Admin ${employee.data.email} already exists`);
      return;
    }

    const roleId = await createRootRole();
    if (!roleId) {
      res
        .status(500)
        .json({
          message: "Admin creation failed",
          error: "Failed to create root role"
        });
      logger.error("Failed to create root role");
      return;
    }

    employee.data.role = new mongoose.Types.ObjectId(roleId);

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
      emailTemplates.welcome(createdAdmin.fullName).subject,
      emailTemplates.welcome(createdAdmin.fullName).html
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
      res
        .status(404)
        .json({ message: "Login failed", error: "Employee not found" });
      logger.warn(`Employee ${employee.data.email} not found`);
      return;
    }

    if (
      !bcrypt.compareSync(employee.data.password!, existingEmployee.password!)
    ) {
      res
        .status(401)
        .json({ message: "Login failed", error: "Invalid credentials" });
      logger.warn(`Invalid credentials for employee ${employee.data.email}`);
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

    res
      .status(200)
      .json({ message: "Employee logged in", data: {
        token,
        refreshToken,
        user: existingEmployee
      } });
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

export async function googleCallback(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    if (!req.user) {
      logger.error("No user data from Google while logging in");
      res
        .status(401)
        .json({
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
