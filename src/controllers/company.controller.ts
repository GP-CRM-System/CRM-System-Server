import type { Request, Response } from "express";
import { SCompany, type ICompany } from "../interfaces/company.interface.js";
import { logger } from "../config/logger.config.js";
import type { IResponse } from "../interfaces/response.interface.js";
import Company from "../models/company.model.js";

export async function createCompany(
  req: Request<object, object, ICompany>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const {
      name,
      ownerId,
      website,
      email,
      industry,
      type,
      address,
      numberOfEmployees
    } = req.body;

    const company = SCompany.safeParse({
      name,
      ownerId,
      website,
      email,
      industry,
      type,
      address,
      numberOfEmployees
    });

    if (company.success === false) {
      res.status(400).json({ message: "Missing required fields", error: company.error.toString() });
      logger.error("Missing required fields");
      return;
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      res
        .status(409)
        .json({ message: "Company with the same email already exists" });
      logger.error(`Company with email ${email} already exists`);
      return;
    }

    logger.info(`Created company ${name}`);
    const createdCompany = await Company.create(company.data);
    res.status(201).json({ message: "Company created", data: createdCompany });
    return;
  } catch (err: unknown) {
    logger.error(`Error creating company: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function getAllCompanies(
  _req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const companies = await Company.find();
    if (companies.length === 0) {
      res.status(404).json({ message: "No companies found" });
      logger.warn("No companies found");
      return;
    }
    logger.info("Retrieved all companies");
    res.status(200).json({ message: "Companies retrieved", data: companies });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving companies: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function getOneCompany(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      logger.warn(`Company with id ${id} not found`);
      return;
    }
    logger.info(`Retrieved company ${company.name}`);
    res.status(200).json({ message: "Company retrieved", data: company });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving company: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }

}

export async function updateCompany(
  req: Request<{ id: string }, object, Partial<ICompany>>,
  res: Response<IResponse>
): Promise<void> {

  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCompany = SCompany.partial().safeParse(updateData);
    if (updatedCompany.success === false) {
      res.status(400).json({ message: "Invalid update fields" });
      logger.error("Invalid update fields");
      return;
    }
    const company = await Company.findById(id);
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      logger.warn(`Company with id ${id} not found`);
      return;
    }
    await Company.updateOne({ _id: id }, { $set: updatedCompany.data });
    logger.info(`Updated company ${company.name}`);
    res.status(200).json({ message: "Company updated", data: company });
    return;
  } catch (err: unknown) {
    logger.error(`Error updating company: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function deactivateCompany(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      logger.warn(`Company with id ${id} not found`);
      return;
    }
    await Company.updateOne(
      { _id: id },
      { $set: { isActive: !company.isActive } }
    );
    logger.info(`Deactivated company ${company.name}`);
    res.status(200).json({ message: "Company deactivated", data: company });
    return;
  } catch (err:unknown) {
    logger.error(`Error deactivating company: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}
