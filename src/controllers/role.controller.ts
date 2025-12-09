import type { Request, Response } from "express";
import { SRole, type IRole } from "../interfaces/role.interface.js";
import { logger } from "../config/logger.config.js";
import Role from "../models/role.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import { verifyToken } from "../services/auth.service.js";

export async function createRole(
    req: Request<object, object, IRole>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Role.write) {
            res.status(401).json({
                message: "Error creating role",
                error: "Unauthorized"
            });
            return;
        }

        const role = await SRole.safeParseAsync(req.body);

        if (role.success === false) {
            res.status(400).json({
                message: "Invalid role payload",
                error: JSON.parse(role.error.message)
            });
            logger.error("Invalid role payload");
            return;
        }

        const existingRole = await Role.findOne({ name: role.data.name });
        if (existingRole) {
            res.status(409).json({
                message: "Error creating role",
                error: "Role with the same name already exists"
            });
            logger.error(`Role ${role.data.name} already exists`);
            return;
        }

        logger.info(`Created role ${role.data.name}`);
        const createdRole = await Role.create(role.data);
        res.status(201).json({ message: "Role created", data: createdRole });
        return;
    } catch (err: unknown) {
        logger.error(`Error creating role: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function getAllRoles(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Role.read) {
            res.status(401).json({
                message: "Error retrieving roles",
                error: "Unauthorized"
            });
            return;
        }

        const { name } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const roles = await Role.find({
            name: { $regex: name ?? "", $options: "i" }
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (roles.length === 0) {
            res.status(404).json({
                message: "Error retrieving roles",
                error: "No roles found"
            });
            logger.warn("No roles found");
            return;
        }
        logger.info("Retrieved all roles");
        res.status(200).json({
            message: "Roles retrieved",
            data: { roles, page, limit, total: roles.length }
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error retrieving roles: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function getOneRole(
    req: Request<{ id: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const id = req.params.id;

        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Role.read) {
            res.status(401).json({
                message: "Error retrieving role",
                error: "Unauthorized"
            });
            return;
        }

        const role = await Role.findById(id);
        if (!role) {
            res.status(404).json({
                message: "Error retrieving role",
                error: "Role not found"
            });
            logger.warn(`Role ${id} not found`);
            return;
        }
        logger.info(`Retrieved role ${id}`);
        res.status(200).json({ message: "Role retrieved", data: role });
        return;
    } catch (err: unknown) {
        logger.error(`Error retreiving role: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function updateRole(
    req: Request<{ id: string }, object, Partial<IRole>>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Role.write) {
            res.status(401).json({
                message: "Error updating role",
                error: "Unauthorized"
            });
            return;
        }

        const id = req.params.id;

        const role = await Role.findById(id);
        if (!role) {
            res.status(404).json({
                message: "Error updating role",
                error: "Role not found"
            });
            logger.warn(`Role ${id} not found`);
            return;
        }

        const updatedRole = await SRole.partial().safeParseAsync(req.body);

        if (updatedRole.success === false) {
            res.status(400).json({
                message: "Invalid role payload",
                error: JSON.parse(updatedRole.error.message)
            });
            logger.error("Invalid role payload");
            return;
        }

        await Role.updateOne({ _id: id }, { $set: updatedRole.data });

        logger.info(`Updated role ${id}`);
        res.status(200).json({ message: "Role updated", data: role });
        return;
    } catch (err: unknown) {
        logger.error(`Error updating role: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function deleteRole(
    req: Request<{ id: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Role.delete) {
            res.status(401).json({
                message: "Error deleting role",
                error: "Unauthorized"
            });
            return;
        }

        const id = req.params.id;

        const role = await Role.findByIdAndDelete(id);
        if (!role) {
            res.status(404).json({
                message: "Error deleting role",
                error: "Role not found"
            });
            logger.warn(`Role ${id} not found`);
            return;
        }
        logger.info(`Deleted role ${id}`);
        res.status(200).json({ message: "Role deleted", data: role });
        return;
    } catch (err: unknown) {
        logger.error(`Error deleting role: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}
