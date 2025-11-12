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
import jwt from "jsonwebtoken";

export async function registerAdmin(
  req: Request<object, object, IEmployee>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const employee = SEmployee.partial().safeParse(req.body);

    if (employee.success === false) {
      res.status(400).json({
        message: "Invalid admin payload",
        error: employee.error.message
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
        .json({ message: "Employee with the same email already exists" });
      logger.error(`Admin ${employee.data.email} already exists`);
      return;
    }

    employee.data.password = bcrypt.hashSync(employee.data.password!, 10);

    const roleId = await createRootRole();
    if (!roleId) {
      res.status(500).json({ message: "Failed to create root role" });
      logger.error("Failed to create root role");
      return;
    }

    employee.data.role = new mongoose.Types.ObjectId(roleId);

    logger.info(`Created admin ${employee.data.email}`);
    const createdAdmin = await Employee.create(employee.data);
    const rootRole = await Role.findById(roleId);

    const token = await generateToken({
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

    res
      .status(201)
      .json({ message: "Admin created", data: { token, refreshToken } });
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

export async function testTokens(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!token || !refreshToken) {
      res.status(401).json({ message: "Unauthorized" });
      logger.error("Unauthorized");
      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    res
      .status(200)
      .json({
        message: "Tokens are valid",
        data: { decodedToken, decodedRefreshToken }
      });
    logger.info("Tokens are valid");
    return;
  } catch (err: unknown) {
    logger.error(`Error testing tokens: ${(err as Error).message}`);
    return;
  }
}
