import type { Request, Response } from "express";
import { STicket, type ITicket } from "../interfaces/ticket.interface.js";
import { logger } from "../config/logger.config.js";
import Ticket from "../models/ticket.model.js";
import type { IResponse } from "../interfaces/response.interface.js";

export async function createTicket(
  req: Request<object, object, ITicket>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const ticket = STicket.safeParse(req.body);

    if (ticket.success === false) {
      res.status(400).json({ message: "Missing required fields" });
      logger.error("Missing required fields");
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
  _req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const tickets = await Ticket.find();
    if (tickets.length === 0) {
      res.status(404).json({ message: "No tickets found" });
      logger.warn("No tickets found");
      return;
    }
    logger.info("Retrieved all tickets");
    res.status(200).json({ message: "Tickets retrieved", data: tickets });
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
  req: Request<{ ticketId: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      logger.warn(`Ticket with id ${ticketId} not found`);
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
  req: Request<{ ticketId: string }, object, Partial<ITicket>>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { ticketId } = req.params;
    const updatedTicket = STicket.partial().safeParse(req.body);

    if (updatedTicket.success === false) {
      res.status(400).json({ message: "Invalid update fields" });
      logger.error("Invalid update fields");
      return;
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      logger.warn(`Ticket with id ${ticketId} not found`);
      return;
    }
    await Ticket.updateOne({ _id: ticketId }, { $set: updatedTicket.data });
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
