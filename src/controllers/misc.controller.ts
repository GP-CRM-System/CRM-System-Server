import type { Request, Response } from "express";
import { verifyToken } from "../services/auth.service.js";
import Contact from "../models/contact.model.js";
import Company from "../models/company.model.js";
import Deal from "../models/deal.model.js";
import Ticket from "../models/ticket.model.js";
import { logger } from "../config/logger.config.js";
import {
    getRevenueData,
    getTicketData
} from "../services/analytics.service.js";

export async function dashboard(req: Request, res: Response): Promise<void> {
    try {
        // Verify Authorization
        const token = verifyToken(req.cookies.token);
        if (!token) {
            res.status(401).json({
                message: "Dashboard access denied",
                error: "Unauthorized"
            });
            return;
        }

        res.status(200).json({
            message: "Dashboard data retrieved",
            data: {
                totalContacts: await Contact.countDocuments(),
                totalCompanies: await Company.countDocuments(),
                totalDeals: await Deal.countDocuments(),
                totalPendingTickets: await Ticket.countDocuments({
                    status: "pending"
                }),
                salesOverview: await getRevenueData(),
                ticketOverview: await getTicketData()
            }
        });
    } catch (err: unknown) {
        logger.error(
            `Error fetching dashboard data: ${(err as Error).message}`
        );
        res.status(500).json({
            message: "Internal server error",
            error: (err as Error).message
        });
        return;
    }
}

export function rateLimiter(_req: Request, res: Response) {
    return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
}

export function healthCheck(_req: Request, res: Response) {
    return res.status(200).json({ status: "OK", timestamp: new Date() });
}

export function notFound(_req: Request, res: Response) {
    return res.status(404).json({ message: "Resource not found." });
}

export function whoami(req: Request, res: Response) {
    const token = verifyToken(req.cookies.token);
    if (token) {
        return res
            .status(200)
            .json({ message: "You are logged in", user: token });
    }
    return res.status(401).json({ message: "You are not logged in" });
}
