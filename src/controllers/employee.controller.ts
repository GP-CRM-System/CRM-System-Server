import type { Request, Response } from "express";
import { SEmployee, type IEmployee } from "../interfaces/employee.interface.js";
import { logger } from "../config/logger.config.js";
import Employee from "../models/employee.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import { verifyToken } from "../services/auth.service.js";
import bcrypt from "bcrypt";

export async function createEmployee(
    req: Request<object, object, IEmployee>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Employee.write) {
            res.status(401).json({
                message: "Error creating employee",
                error: "Unauthorized"
            });
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
            res.status(409).json({
                message: "Error creating employee",
                error: "Employee with the same email already exists"
            });
            logger.error(
                `Employee with email ${employee.data.email} already exists`
            );
            return;
        }

        logger.info(`Created employee ${employee.data.fullName}`);
        employee.data.password = bcrypt.hashSync(employee.data.password!, 10);
        const createdEmployee = await Employee.create(employee.data);
        res.status(201).json({
            message: "Employee created",
            data: createdEmployee
        });
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
            res.status(401).json({
                message: "Error retrieving employees",
                error: "Unauthorized"
            });
            return;
        }

        const { fullName } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const filter = {
            fullName: { $regex: fullName ?? "", $options: "i" }
        };
        const total = await Employee.countDocuments(filter);
        const employees = await Employee.find(filter)
            .select("-password -__v")
            .populate("role")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 1 });

        if (employees.length === 0) {
            res.status(404).json({
                message: "Error retrieving employees",
                error: "No employees found"
            });
            logger.warn("No employees found");
            return;
        }
        const totalPages = Math.ceil(total / limit);
        logger.info(`Retrieved ${employees.length} employees`);
        res.status(200).json({
            message: "Employees retrieved",
            data: {
                data: employees,
                total,
                page,
                limit,
                totalPages
            }
        });
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
            res.status(401).json({
                message: "Error retrieving employee",
                error: "Unauthorized"
            });
            return;
        }

        const id = req.params.id;

        const employee = await Employee.findById(id).select("-password");
        if (!employee) {
            res.status(404).json({
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
            res.status(401).json({
                message: "Error updating employee",
                error: "Unauthorized"
            });
            return;
        }

        const id = req.params.id;
        //@ts-expect-error bad jwt types
        if (token!._id === id) {
            res.status(401).json({
                message: "Error updating employee",
                error: "Unauthorized"
            });
            logger.warn(`Employee ${id} is trying to update themselves`);
            return;
        }

        const employee = await Employee.findById(id)
            .populate("role")
            .select("-password");
        if (!employee) {
            res.status(404).json({
                message: "Error updating employee",
                error: "Employee not found"
            });
            logger.warn(`Employee ${id} not found`);
            return;
        }

        const updatedEmployee = await SEmployee.partial().safeParseAsync(
            req.body
        );

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
            res.status(401).json({
                message: "Error deleting employee",
                error: "Unauthorized"
            });
            return;
        }

        const id = req.params.id;

        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            res.status(404).json({
                message: "Error deleting employee",
                error: "Employee not found"
            });
            logger.warn(`Employee ${id} not found`);
            return;
        }
        logger.info(`Deleted employee ${employee.fullName}`);
        res.status(200).json({
            message: "Employee deleted",
            data: employee
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error deleting employee: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function inviteEmployee(
    req: Request<object, object, { email: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Employee.write) {
            res.status(401).json({
                message: "Error inviting employee",
                error: "Unauthorized"
            });
            return;
        }

        const { email } = req.body;

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({
                message: "Error inviting employee",
                error: "Invalid email address"
            });
            return;
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            res.status(409).json({
                message: "Error inviting employee",
                error: "Employee with this email already exists"
            });
            logger.warn(`Invite failed: Employee with email ${email} already exists`);
            return;
        }

        // Find or get default "Employee" role
        let defaultRole = await import("../models/role.model.js").then(m => m.default.findOne({ name: "Employee" }));

        if (!defaultRole) {
            // Create default Employee role if it doesn't exist
            const Role = (await import("../models/role.model.js")).default;
            defaultRole = await Role.create({
                name: "Employee",
                isActive: true,
                Company: { read: false, write: false, delete: false },
                Employee: { read: false, write: false, delete: false },
                Contact: { read: true, write: false, delete: false },
                Deal: { read: true, write: false, delete: false },
                Role: { read: false, write: false, delete: false },
                Order: { read: true, write: false, delete: false },
                Ticket: { read: true, write: true, delete: false }
            });
            logger.info("Created default Employee role");
        }

        // Generate temporary password (12 characters, alphanumeric)
        const crypto = await import("crypto");
        const tempPassword = crypto.randomBytes(6).toString('hex'); // 12 char hex string
        const hashedPassword = bcrypt.hashSync(tempPassword, 10);

        // Create employee with temp password
        await Employee.create({
            email,
            fullName: "",
            phone: "",
            password: hashedPassword,
            role: defaultRole._id,
            salary: 0,
            isActive: true
        });

        // Send invitation email with temp password
        const { sendEmail, emailTemplates } = await import("../config/mail.config.js");
        const senderName = (token as any)?.fullName || "Admin";
        const appUrl = process.env.APP_URL || "http://localhost:5173";
        const emailTemplate = emailTemplates.teamInvite(
            senderName,
            email,
            tempPassword,
            appUrl
        );

        await sendEmail(email, emailTemplate.subject, emailTemplate.html);

        logger.info(`Invited employee with email ${email}`);
        res.status(201).json({
            message: "Employee invited successfully",
            data: {
                email,
                tempPassword, // Return temp password for admin to share if email fails
                loginUrl: `${appUrl}/login`
            }
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error inviting employee: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}
