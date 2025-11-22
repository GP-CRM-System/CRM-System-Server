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

    // Populate role permissions for response
    const user = {
      _id: createdAdmin._id,
      fullName: createdAdmin.fullName,
      email: createdAdmin.email,
      role: rootRole || {},
      phone: createdAdmin.phone,
      salary: createdAdmin.salary,
      isActive: createdAdmin.isActive
    };

    res
      .status(201)
      .json({ message: "Admin created", data: { token, refreshToken, user } });
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
    const employee = SEmployee.partial().safeParse(req.body);

    if (employee.success === false) {
      res.status(400).json({
        message: "Invalid employee payload",
        error: employee.error.message
      });
      logger.error("Invalid employee payload");
      return;
    }

    console.log("employee", employee);
    const existingEmployee = await Employee.findOne({
      email: employee.data.email
    }).populate("role");
    if (!existingEmployee) {
      res.status(404).json({ message: "Employee not found" });
      logger.warn(`Employee ${employee.data.email} not found`);
      return;
    }

    console.log("existingEmployee", existingEmployee);

    if (
      !bcrypt.compareSync(employee.data.password!, existingEmployee.password!)
    ) {
      res.status(401).json({ message: "Invalid credentials" });
      logger.warn(`Invalid credentials for employee ${employee.data.email}`);
      return;
    }

    const token = await generateToken({
      _id: existingEmployee._id,
      email: existingEmployee.email,
      // @ts-expect-error role is populated
      role: existingEmployee.role
    });
    const refreshToken = await generateRefreshToken({
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
      .json({ message: "Employee logged in", data: existingEmployee });
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

// export async function forgotPassword(
//   req: Request<{id:string}>,
//   res:Response<IResponse>
// ):Promise<void> {
//   try {
    
//   } catch (error) {
    
//   }
// }