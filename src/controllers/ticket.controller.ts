import type { Request, Response } from "express";
import { STicket, type ITicket } from "../interfaces/ticket.interface.js";
import { logger } from "../config/logger.config.js";
import Ticket from "../models/ticket.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import { verifyToken } from "../services/auth.service.js";

export async function createTicket(
  req: Request<object, object, ITicket>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Ticket.write) {
      res
        .status(401)
        .json({ message: "Error creating ticket", error: "Unauthorized" });
      return;
    }

    const ticket = await STicket.safeParseAsync(req.body);

    if (ticket.success === false) {
      res.status(400).json({
        message: "Invalid ticket payload",
        error: JSON.parse(ticket.error.message)
      });
      logger.error("Invalid ticket payload");
      return;
    }

    const newTicket = new Ticket(ticket.data);
    await newTicket.save();
    logger.info(`Created ticket ${ticket.data.name}`);
    res.status(201).json({ message: "Ticket created", data: newTicket });
    return;
  } catch (err: unknown) {
    logger.error(`Error creating ticket: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function getAllTickets(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Ticket.read) {
      res
        .status(401)
        .json({ message: "Error retrieving tickets", error: "Unauthorized" });
      return;
    }

    const { name, priority, source } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({
      name: { $regex: name ?? "", $options: "i" },
      priority: { $regex: priority ?? "", $options: "i" },
      source: { $regex: source ?? "", $options: "i" }
    })
      .populate("owner", "fullName")
      .populate("contact", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (tickets.length === 0) {
      res.status(404).json({
        message: "Error retrieving tickets",
        error: "No tickets found"
      });
      logger.warn("No tickets found");
      return;
    }
    logger.info("Retrieved all tickets");
    res
      .status(200)
      .json({
        message: "Tickets retrieved",
        data: { tickets, total: tickets.length, page, limit }
      });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving tickets: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function getOneTicket(
  req: Request<{ id: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { id } = req.params;

    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Ticket.read) {
      res
        .status(401)
        .json({ message: "Error retrieving ticket", error: "Unauthorized" });
      return;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404).json({
        message: "Error retrieving ticket",
        error: "Ticket not found"
      });
      logger.warn(`Ticket with id ${id} not found`);
      return;
    }
    logger.info(`Retrieved ticket ${ticket.name}`);
    res.status(200).json({ message: "Ticket retrieved", data: ticket });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving ticket: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function updateTicket(
  req: Request<{ id: string }, object, Partial<ITicket>>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Ticket.write) {
      res
        .status(401)
        .json({ message: "Error updating ticket", error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const updatedTicket = await STicket.partial().safeParseAsync(req.body);

    if (updatedTicket.success === false) {
      res.status(400).json({
        message: "Invalid update fields",
        error: JSON.parse(updatedTicket.error.message)
      });
      logger.error("Invalid update fields");
      return;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res
        .status(404)
        .json({ message: "Error updating ticket", error: "Ticket not found" });
      logger.warn(`Ticket with id ${id} not found`);
      return;
    }
    await Ticket.updateOne({ _id: id }, { $set: updatedTicket.data });
    logger.info(`Updated ticket ${ticket.name}`);
    res.status(200).json({ message: "Ticket updated", data: ticket });
    return;
  } catch (err: unknown) {
    logger.error(`Error updating ticket: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}

export async function addNewTicketStatus(
  req: Request<
    { id: string },
    object,
    {
      statusType:
        | "New"
        | "Waiting on Contact"
        | "Waiting on Employee"
        | "Closed";
    }
  >,
  res: Response<IResponse>
): Promise<void> {
  try {
    const token = verifyToken(req.cookies.token);
    // @ts-expect-error bad jwt types
    if (!token.role.Ticket.write) {
      res
        .status(401)
        .json({ message: "Error updating ticket", error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { statusType } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res
        .status(404)
        .json({ message: "Error updating ticket", error: "Ticket not found" });
      logger.warn(`Ticket with id ${id} not found`);
      return;
    }
    ticket.status.push({ statusType, date: new Date() });
    await ticket.save();
    logger.info(`Updated ticket ${ticket.name}`);
    res.status(200).json({ message: "Ticket updated", data: ticket });
    return;
  } catch (err: unknown) {
    logger.error(`Error updating ticket: ${(err as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message
    });
    return;
  }
}
