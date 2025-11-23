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
      res
        .status(401)
        .json({ message: "Error creating employee", error: "Unauthorized" });
      return;
    }

    const employee = await SEmployee.safeParseAsync(req.body);

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
    });
    if (existingEmployee) {
      res
        .status(409)
        .json({
          message: "Error creating employee",
          error: "Employee with the same email already exists"
        });
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
      res
        .status(401)
        .json({ message: "Error retrieving employees", error: "Unauthorized" });
      return;
    }

    const employees = await Employee.find()
      .select("-password -__v")
      .populate("role");
    if (employees.length === 0) {
      res
        .status(404)
        .json({
          message: "Error retrieving employees",
          error: "No employees found"
        });
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
      res
        .status(401)
        .json({ message: "Error retrieving employee", error: "Unauthorized" });
      return;
    }

    const id = req.params.id;

    const employee = await Employee.findById(id).select("-password");
    if (!employee) {
      res
        .status(404)
        .json({
          message: "Error retrieving employee",
          error: "Employee not found"
        });
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
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Employee.write) {
      res
        .status(401)
        .json({ message: "Error updating employee", error: "Unauthorized" });
      return;
    }

    const id = req.params.id;

    const employee = await Employee.findById(id);
    if (!employee) {
      res
        .status(404)
        .json({
          message: "Error updating employee",
          error: "Employee not found"
        });
      logger.warn(`Employee ${id} not found`);
      return;
    }

    const updatedEmployee = await SEmployee.partial().safeParseAsync(req.body);

    if (updatedEmployee.success === false) {
      res.status(400).json({
        message: "Error updating employee",
        error: JSON.parse(updatedEmployee.error.message)
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
      res
        .status(401)
        .json({
          message: "Error deactivating employee",
          error: "Unauthorized"
        });
      return;
    }

    const id = req.params.id;

    const employee = await Employee.findById(id);
    if (!employee) {
      res
        .status(404)
        .json({
          message: "Error deactivating employee",
          error: "Employee not found"
        });
      logger.warn(`Employee ${id} not found`);
      return;
    }
    await Employee.updateOne(
      { _id: id },
      { $set: { isActive: !employee.isActive } }
    );
    logger.info(`Deactivated employee ${employee.fullName}`);
    res.status(200).json({ message: "Employee deactivated", data: employee });
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
