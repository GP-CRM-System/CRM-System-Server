import type { Request, Response } from "express";
import { SDeal, type IDeal } from "../interfaces/deal.interface.js";
import { logger } from "../config/logger.config.js";
import Deal from "../models/deal.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import Contact from "../models/contact.model.js";

export async function createDeal(
  req: Request<object, object, IDeal>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { name, stage, amount, ownerId, priority, contactId, companyId } =
      req.body;
  
    const deal = SDeal.safeParse({
      name,
      stage,
      amount,
      ownerId,
      priority,
      contactId,
      companyId
    });
  
    if (deal.success === false) {
      res.status(400).json({ message: "Missing required fields" });
      logger.error("Missing required fields");
      return;
    }
  
    const existingDeal = await Deal.findOne({ name });
    if (existingDeal) {
      res.status(409).json({ message: "Deal with the same name already exists" });
      logger.error(`Deal with name ${name} already exists`);
      return;
    }
  
    const contact = await Contact.findById(contactId);
    if (!contact) {
      res.status(404).json({ message: "Associated contact not found" });
      logger.error(`Associated contact with ID ${contactId} not found`);
      return;
    } else {
      if (contact.stage[contact.stage.length - 1]!.name !== "Customer") {
        contact.stage.push({ name: "Customer", date: new Date() });
        await contact.save();
        logger.info(
          `Updated contact ${contact.name} stage to Customer due to new deal creation`
        );
      }
    }
  
    logger.info(`Created deal ${name}`);
    const createdDeal = await Deal.create(deal.data);
    res.status(201).json({ message: "Deal created", data: createdDeal });
    return;
  } catch (err: unknown) {
    logger.error(`Error creating deal: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function getAllDeals(
  _req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const deals = await Deal.find();
    if (deals.length === 0) {
      res.status(404).json({ message: "No deals found" });
      logger.warn("No deals found");
      return;
    }
    logger.info("Retrieved all deals");
    res.status(200).json({ message: "Deals retrieved", data: deals });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving deals: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function getOneDeal(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { id } = req.params;
    const deal = await Deal.findById(id);
    if (!deal) {
      res.status(404).json({ message: "Deal not found" });
      logger.warn(`Deal with id ${id} not found`);
      return;
    }
    logger.info(`Retrieved deal ${deal.name}`);
    res.status(200).json({ message: "Deal retrieved", data: deal });
    return;
  } catch (err: unknown) {
    logger.error(`Error retreiving deal: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function updateDeal(
  req: Request<{ id: string }, object, Partial<IDeal>>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedDeal = SDeal.partial().safeParse(updateData);
    if (updatedDeal.success === false) {
      res.status(400).json({ message: "Invalid update fields" });
      logger.error("Invalid update fields");
      return;
    }
    const deal = await Deal.findById(id);
    if (!deal) {
      res.status(404).json({ message: "Deal not found" });
      logger.warn(`Deal with id ${id} not found`);
      return;
    }
    await Deal.updateOne({ _id: id }, { $set: updatedDeal.data });
    logger.info(`Updated deal ${deal.name}`);
    res.status(200).json({ message: "Deal updated", data: deal });
    return;
  } catch (err: unknown) {
    logger.error(`Error updating deal: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}
