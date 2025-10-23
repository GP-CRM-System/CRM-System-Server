import type { Request, Response } from "express";
import { SEmployee, type IEmployee } from "../interfaces/employee.interface.js";
import { logger } from "../config/logger.config.js";
import Employee from "../models/employee.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import bcrypt from "bcrypt";

export async function createEmployee(
  req: Request<object, object, IEmployee>,
  res: Response<IResponse>
): Promise<void> {
  const { fullName, phone, email, password, salary, roleId } = req.body;

  if (!fullName || !phone || !email || !password || !salary || !roleId) {
    res.status(400).json({ message: "Missing required fields" });
    logger.error("Missing required fields");
    return;
  }

  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    res
      .status(409)
      .json({ message: "Employee with the same email already exists" });
    logger.error(`Employee with email ${email} already exists`);
    return;
  }

  const hashedPassword = bcrypt.hashSync(password!, 10);

  const employee = SEmployee.safeParse({
    fullName,
    phone,
    email,
    password: hashedPassword,
    salary,
    roleId
  });

  if (employee.success === false) {
    res
      .status(400)
      .json({
        message: "Invalid employee payload",
        error: employee.error.message
      });
    logger.error("Invalid employee payload");
    return;
  }

  logger.info(`Created employee ${fullName}`);
  const createdEmployee = await Employee.create(employee.data);
  res.status(201).json({ message: "Employee created", data: createdEmployee });
  return;
}

export async function getAllEmployees(
  _req: Request,
  res: Response<IResponse>
): Promise<void> {
  const employees = await Employee.find().select("-password");
  if (employees.length === 0) {
    res.status(404).json({ message: "No employees found" });
    logger.warn("No employees found");
    return;
  }
  logger.info("Retrieved all employees");
  res.status(200).json({ message: "Employees retrieved", data: employees });
  return;
}

export async function getOneEmployee(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
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
}

export async function updateEmployee(
  req: Request<{ id: string }, object, IEmployee>,
  res: Response<IResponse>
): Promise<void> {
  const id = req.params.id;
  const { fullName, phone, email, password, salary, roleId } = req.body;

  const employee = await Employee.findById(id);
  if (!employee) {
    res.status(404).json({ message: "employee not found" });
    logger.warn(`employee ${id} not found`);
    return;
  }

  
  const hashedPassword = bcrypt.hashSync(password!, 10);

  const updatedRole = SEmployee.safeParse({
    fullName,
    phone,
    email,
    password: hashedPassword,
    salary,
    roleId
  });

  if (updatedRole.success === false) {
    res
      .status(400)
      .json({
        message: "Invalid role payload",
        error: updatedRole.error.message
      });
    logger.error("Invalid role payload");
    return;
  }

  await Employee.updateOne({ _id: id }, { $set: updatedRole.data });

  logger.info(`Updated employee ${employee.fullName}`);
  res.status(200).json({ message: "Employee updated", data: employee });
  return;
}

export async function deleteEmployee(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
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
}
