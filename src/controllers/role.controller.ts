import type { Request, Response } from "express";
import { z } from "zod";
import { SRole } from "../interfaces/role.interface.js";
import { logger } from "../config/logger.config.js";
import Role from "../models/role.model.js";

export async function createRole(
  req: Request<object, object, z.infer<typeof SRole>>,
  res: Response
): Promise<void> {
  const { name, permissions } = req.body;

  const role = SRole.safeParse({ name, permissions });

  if (role.success === false) {
    res.status(400).json({ error: role.error.message });
    logger.error("Invalid role payload");
    return;
  }

  logger.info(`Created role ${name}`);
  const createdRole = await Role.create(role.data);
  res.status(201).json({ message: "Role created", role: createdRole });
}