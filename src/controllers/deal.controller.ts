import type { Request, Response } from "express";
import { SDeal, type IDeal } from "../interfaces/deal.interface.js";
import { logger } from "../config/logger.config.js";
import Deal from "../models/deal.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import Contact from "../models/contact.model.js";
import { verifyToken } from "../services/auth.service.js";

export async function createDeal(
    req: Request<object, object, IDeal>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Deal.write) {
            res.json({
                message: "Deal creation failed",
                error: "Unauthorized"
            });
            return;
        }

        const deal = await SDeal.safeParseAsync(req.body);

        if (deal.success === false) {
            res.status(400).json({
                message: "Deal creation failed",
                error: JSON.parse(deal.error.message)
            });
            logger.error("Missing required fields in deal creation");
            return;
        }

        const existingDeal = await Deal.findOne({ name: deal.data.name });
        if (existingDeal) {
            res.status(409).json({
                message: "Deal creation failed",
                error: "Deal with the same name already exists"
            });
            logger.error(`Deal with name ${deal.data.name} already exists`);
            return;
        }

        const associatedContact = await Contact.findById(deal.data.contact);
        if (!associatedContact) {
            res.status(404).json({
                message: "Associated contact not found",
                error: "Associated contact not found"
            });
            logger.error(
                `Associated contact with ID ${deal.data.contact} not found`
            );
            return;
        } else {
            if (
                associatedContact.stage[associatedContact.stage.length - 1]!
                    .name !== "Customer"
            ) {
                associatedContact.stage.push({
                    name: "Customer",
                    date: new Date()
                });
                await associatedContact.save();
                logger.info(
                    `Updated contact ${associatedContact.name} stage to Customer due to new deal creation`
                );
            }
        }

        logger.info(`Created deal ${deal.data.name}`);
        const createdDeal = await Deal.create(deal.data);
        res.status(201).json({ message: "Deal created", data: createdDeal });
        return;
    } catch (err: unknown) {
        logger.error(`Error creating deal: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function getAllDeals(
    req: Request,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Deal.read) {
            res.json({
                message: "Deals retrieval failed",
                error: "Unauthorized"
            });
            return;
        }

        const { name, priority } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const deals = await Deal.find({
            name: { $regex: name ?? "", $options: "i" },
            priority: { $regex: priority ?? "", $options: "i" }
        })
            .skip(skip)
            .limit(limit)
            .populate("owner", "fullName")
            .populate("contact", "name")
            .populate("company", "name");

        if (deals.length === 0) {
            res.status(404).json({
                message: "Deals retrieval failed",
                error: "No deals found"
            });
            logger.warn("No deals found");
            return;
        }
        logger.info("Retrieved all deals");
        res.status(200).json({
            message: "Deals retrieved",
            data: { deals, page, limit, total: deals.length }
        });
        return;
    } catch (err: unknown) {
        logger.error(`Error retrieving deals: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function getOneDeal(
    req: Request<{ id: string }>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Deal.read) {
            res.json({
                message: "Deal retrieval failed",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;
        const deal = await Deal.findById(id);
        if (!deal) {
            res.status(404).json({
                message: "Deal retrieval failed",
                error: "Deal not found"
            });
            logger.warn(`Deal with id ${id} not found`);
            return;
        }
        logger.info(`Retrieved deal ${deal.name}`);
        res.status(200).json({ message: "Deal retrieved", data: deal });
        return;
    } catch (err: unknown) {
        logger.error(`Error retreiving deal: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function updateDeal(
    req: Request<{ id: string }, object, Partial<IDeal>>,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Deal.write) {
            res.status(401).json({
                message: "Deal retrieval failed",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;
        const updateData = req.body;
        const updatedDeal = await SDeal.partial().safeParseAsync(updateData);
        if (updatedDeal.success === false) {
            res.status(400).json({
                message: "Invalid update fields",
                error: JSON.parse(updatedDeal.error.message)
            });
            logger.error(`Invalid update fields for deal ${id}`);
            return;
        }
        const deal = await Deal.findById(id);
        if (!deal) {
            res.status(404).json({
                message: "Deal updating failed",
                error: "Deal not found"
            });
            logger.warn(`Deal with id ${id} not found`);
            return;
        }
        await Deal.updateOne({ _id: id }, { $set: updatedDeal.data });
        logger.info(`Updated deal ${deal.name}`);
        res.status(200).json({ message: "Deal updated", data: deal });
        return;
    } catch (err: unknown) {
        logger.error(`Error updating deal: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export async function addNewDealStage(
    req: Request<
        { id: string },
        object,
        {
            name:
                | "Appointment Scheduled"
                | "Qualified To Buy"
                | "Presentation Scheduled"
                | "Decision Maker Bought-In"
                | "Contract Sent"
                | "Closed Won"
                | "Closed Lost";
        }
    >,
    res: Response<IResponse>
): Promise<void> {
    try {
        const token = verifyToken(req.cookies.token);
        // @ts-expect-error bad jwt types
        if (!token.role.Deal.write) {
            res.status(401).json({
                message: "Error updating deal",
                error: "Unauthorized"
            });
            return;
        }

        const { id } = req.params;
        const { name } = req.body;
        const deal = await Deal.findById(id);
        if (!deal) {
            res.status(404).json({
                message: "Error updating deal",
                error: "Deal not found"
            });
            logger.warn(`Deal with id ${id} not found`);
            return;
        }
        deal.stage.push({ name, date: new Date() });
        await deal.save();
        logger.info(`Updated deal ${deal.name}`);
        res.status(200).json({ message: "Deal updated", data: deal });
        return;
    } catch (err: unknown) {
        logger.error(`Error updating deal: ${(err as Error).message}`);
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}
