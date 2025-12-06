import type { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import type { IResponse } from "../interfaces/response.interface.js";
import {
  getCancellationRate,
  getConversionRate,
  getLeadData,
  getNumberOfOrders,
  getProductData,
  getRevenueData,
  getTicketData,
  getTotalRevenue
} from "../services/analytics.service.js";

export async function getCards(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const totalRevenue = (await getTotalRevenue()) || 0;
    const numberOfOrders = (await getNumberOfOrders()) || 0;
    const conversionRate = (await getConversionRate()) || 0;
    const cancellationRate = (await getCancellationRate()) || 0;
    const revenueChange = (await getTotalRevenue(true)) || 0;
    const ordersChange = (await getNumberOfOrders(true)) || 0;
    const conversionChange = (await getConversionRate(true)) || 0;
    const cancellationChange = (await getCancellationRate(true)) || 0;

    res.status(200).json({
      message: "Cards fetched successfully",
      data: {
        totalRevenue,
        numberOfOrders,
        conversionRate: conversionRate.toFixed(1),
        cancellationRate: cancellationRate.toFixed(1),
        revenueChange,
        ordersChange,
        conversionChange: conversionChange.toFixed(1),
        cancellationChange: cancellationChange.toFixed(1)
      }
    });
  } catch (error: unknown) {
    logger.error(`Error fetching cards: ${(error as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message
    });
    return;
  }
}

export async function getRevenueTrends(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const revenueData = await getRevenueData();
    res.status(200).json({
      message: "Revenue trends fetched successfully",
      data: revenueData
    });
  } catch (error: unknown) {
    logger.error(`Error fetching revenue trends: ${(error as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message
    });
    return;
  }
}

export async function getTicketStatuses(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const ticketData = await getTicketData();
    res.status(200).json({
      message: "Ticket statuses fetched successfully",
      data: ticketData
    });
  } catch (error: unknown) {
    logger.error(`Error fetching ticket statuses: ${(error as Error).message}`);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message
    });
    return;
  }
}

export async function getProductPerformance(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const productData = await getProductData();
    res.status(200).json({
      message: "Product performance fetched successfully",
      data: productData
    });
  } catch (error: unknown) {
    logger.error(
      `Error fetching product performance: ${(error as Error).message}`
    );
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message
    });
    return;
  }
}

export async function getLeadConversions(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const leadData = await getLeadData();
    res.status(200).json({
      message: "Lead conversions fetched successfully",
      data: leadData
    });
  } catch (error: unknown) {
    logger.error(
      `Error fetching lead conversions: ${(error as Error).message}`
    );
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message
    });
    return;
  }
}
