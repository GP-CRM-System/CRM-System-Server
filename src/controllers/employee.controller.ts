import type { Request, Response } from "express";
import { SEmployee, type IEmployee } from "../interfaces/employee.interface.js";
import { logger } from "../config/logger.config.js";
import Employee from "../models/employee.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import { verifyToken } from "../services/auth.service.js";

export async function createEmployee(
  req: Request<object, object, IEmployee>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Employee.write) {
      res.json({ message: "Unauthorized" });
    }

    const employee = SEmployee.safeParse(req.body);

    if (employee.success === false) {
      res.status(400).json({
        message: "Invalid employee payload",
        error: employee.error.message
      });
      logger.error("Invalid employee payload");
      return;
    }

    const existingEmployee = await Employee.findOne({
      email: employee.data.email
    });
    if (existingEmployee) {
      res
        .status(409)
        .json({ message: "Employee with the same email already exists" });
      logger.error(`Employee with email ${employee.data.email} already exists`);
      return;
    }

    logger.info(`Created employee ${employee.data.fullName}`);
    const createdEmployee = await Employee.create(employee.data);
    res
      .status(201)
      .json({ message: "Employee created", data: createdEmployee });
    return;
  } catch (err: unknown) {
    logger.error(`Error creating employee: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function getAllEmployees(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Employee.read) {
      res.json({ message: "Unauthorized" });
    }

    const employees = await Employee.find()
      .select("-password")
      .populate("role");
    if (employees.length === 0) {
      res.status(404).json({ message: "No employees found" });
      logger.warn("No employees found");
      return;
    }
    logger.info("Retrieved all employees");
    res.status(200).json({ message: "Employees retrieved", data: employees });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving employees: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function getOneEmployee(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Employee.read) {
      res.json({ message: "Unauthorized" });
    }

    const id = req.params.id;

    const employee = await Employee.findById(id).select("-password");
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      logger.warn(`Employee ${id} not found`);
      return;
    }
    logger.info(`Retrieved Employee ${employee.fullName}`);
    res.status(200).json({ message: "Employee retrieved", data: employee });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving employee: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function updateEmployee(
  req: Request<{ id: string }, object, Partial<IEmployee>>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Employee.write) {
      res.json({ message: "Unauthorized" });
    }

    const id = req.params.id;

    const employee = await Employee.findById(id);
    if (!employee) {
      res.status(404).json({ message: "employee not found" });
      logger.warn(`employee ${id} not found`);
      return;
    }

    const updatedEmployee = SEmployee.partial().safeParse(req.body);

    if (updatedEmployee.success === false) {
      res.status(400).json({
        message: "Invalid employee payload",
        error: updatedEmployee.error.message
      });
      logger.error("Invalid employee payload");
      return;
    }

    await Employee.updateOne({ _id: id }, { $set: updatedEmployee.data });

    logger.info(`Updated employee ${employee.fullName}`);
    res.status(200).json({ message: "Employee updated", data: employee });
    return;
  } catch (err: unknown) {
    logger.error(`Error updating employee: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function deactivateEmployee(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Employee.delete) {
      res.json({ message: "Unauthorized" });
    }

    const id = req.params.id;

    const employee = await Employee.findById(id);
    if (!employee) {
      res.status(404).json({ message: "employee not found" });
      logger.warn(`employee ${id} not found`);
      return;
    }
    await Employee.updateOne(
      { _id: id },
      { $set: { isActive: !employee.isActive } }
    );
    logger.info(`Deactivated employee ${employee.fullName}`);
    res.status(200).json({ message: "employee Deactivated" });
    return;
  } catch (err: unknown) {
    logger.error(`Error deactivating employee: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}
