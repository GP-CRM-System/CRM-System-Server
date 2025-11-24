import type { Request, Response } from "express";
import { SCompany, type ICompany } from "../interfaces/company.interface.js";
import { logger } from "../config/logger.config.js";
import type { IResponse } from "../interfaces/response.interface.js";
import Company from "../models/company.model.js";
import { verifyToken } from "../services/auth.service.js";

export async function createCompany(
  req: Request<object, object, ICompany>,
  res: Response<IResponse>
): Promise<void> {
  try {
    // Verify Authorization
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Company.write) {
      res
        .status(401)
        .json({ message: "Company creation failed", error: "Unauthorized" });
      return;
    }

    // Validate company payload
    const company = await SCompany.partial().safeParseAsync(req.body);

    if (company.success === false) {
      res.status(400).json({
        message: "Invalid fields for company creation",
        error: JSON.parse(company.error.message)
      });
      logger.error(`Invalid fields for company creation`);
      return;
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({
      email: company.data.email
    });
    if (existingCompany) {
      res
        .status(409)
        .json({
          message: "Company creation failed",
          error: "Company with the same email already exists"
        });
      logger.error(`Company with email ${company.data.email} already exists`);
      return;
    }

    // Create company
    logger.info(`Created company ${company.data.name}`);
    const createdCompany = await Company.create(company.data);
    res.status(201).json({ message: "Company created", data: createdCompany });
    return;
  } catch (err: unknown) {
    logger.error(`Error creating company: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function getAllCompanies(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Company.read) {
      res
        .status(401)
        .json({ message: "Company retrieval failed", error: "Unauthorized" });
      return;
    }

    // Querying logic
    const { name, industry, type } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;


    const companies = await Company.find({
      name: { $regex: name ?? "", $options: "i" },
      industry: { $regex: industry ?? "", $options: "i" },
      type: { $regex: type ?? "", $options: "i" }
    })
      .populate("contact", "name")
      .populate("owner", "fullName")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (companies.length === 0) {
      res
        .status(404)
        .json({
          message: "Company retrieval failed",
          error: "No companies found"
        });
      logger.warn("No companies found");
      return;
    }
    logger.info(`Retrieved ${companies.length} companies`);
    res.status(200).json({ message: "Companies retrieved", data: { companies, total: companies.length, page, limit } });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving companies: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function getOneCompany(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Company.read) {
      res
        .status(401)
        .json({ message: "Company retrieval failed", error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      res
        .status(404)
        .json({
          message: "Company retrieval failed",
          error: "Company not found"
        });
      logger.warn(`Company with id ${id} not found`);
      return;
    }
    logger.info(`Retrieved company ${company.name}`);
    res.status(200).json({ message: "Company retrieved", data: company });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving company: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function updateCompany(
  req: Request<{ id: string }, object, Partial<ICompany>>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Company.write) {
      res
        .status(401)
        .json({ message: "Company update failed", error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;
    const updatedCompany = await SCompany.partial().safeParseAsync(updateData);
    if (updatedCompany.success === false) {
      res
        .status(400)
        .json({
          message: "Invalid update fields",
          error: JSON.parse(updatedCompany.error.message)
        });
      logger.error("Invalid update fields");
      return;
    }
    const company = await Company.findById(id);
    if (!company) {
      res
        .status(404)
        .json({ message: "Company update failed", error: "Company not found" });
      logger.warn(`Company with id ${id} not found`);
      return;
    }
    await Company.updateOne({ _id: id }, { $set: updatedCompany.data });
    logger.info(`Updated company ${company.name}`);
    res.status(200).json({ message: "Company updated", data: company });
    return;
  } catch (err: unknown) {
    logger.error(`Error updating company: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function deactivateCompany(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Company.delete) {
      res
        .status(401)
        .json({
          message: "Company deactivation failed",
          error: "Unauthorized"
        });
      return;
    }

    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      res
        .status(404)
        .json({
          message: "Company deactivation failed",
          error: "Company not found"
        });
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
  } catch (err: unknown) {
    logger.error(`Error deactivating company: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}
