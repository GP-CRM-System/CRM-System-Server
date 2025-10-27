import type { Request, Response } from "express";
import { SOrder, type IOrder } from "../interfaces/order.interface.js";
import { logger } from "../config/logger.config.js";
import Order from "../models/order.model.js";
import type { IResponse } from "../interfaces/response.interface.js";
import Contact from "../models/contact.model.js";

export async function createOrder(
  req: Request<object, object, IOrder>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { description, price, ownerId, stage, contactId, employeeId } =
      req.body;
    const order = SOrder.safeParse({
      description,
      price,
      ownerId,
      stage,
      contactId,
      employeeId
    });

    if (order.success === false) {
      res.status(400).json({ message: "Missing required fields" });
      logger.error("Missing required fields");
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
          `Updated contact ${contact.name} stage to Customer due to new order creation`
        );
      }
    }

    logger.info(`Created order with description ${description}`);
    const createdOrder = await Order.create(order.data);
    res.status(201).json({ message: "Order created", data: createdOrder });
    return;
  } catch (err: unknown) {
    logger.error(`Error creating order: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function getAllOrders(
  _req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      res.status(404).json({ message: "No orders found" });
      logger.warn("No orders found");
      return;
    }
    logger.info("Retrieved all orders");
    res.status(200).json({ message: "Orders retrieved", data: orders });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving orders: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function getOneOrder(
  req: Request<{ orderId: string }>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      logger.warn(`Order with id ${orderId} not found`);
      return;
    }
    logger.info(`Retrieved order ${order.description}`);
    res.status(200).json({ message: "Order retrieved", data: order });
    return;
  } catch (err: unknown) {
    logger.error(`Error retrieving order: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}

export async function updateOrder(
  req: Request<{ orderId: string }, object, Partial<IOrder>>,
  res: Response<IResponse>
): Promise<void> {
  try {
    const { orderId } = req.params;
    const { description, price, ownerId, stage, contactId, employeeId } =
      req.body;
    const order = SOrder.partial().safeParse({
      description,
      price,
      ownerId,
      stage,
      contactId,
      employeeId
    });

    if (order.success === false) {
      res.status(400).json({ message: "Missing required fields" });
      logger.error("Missing required fields");
      return;
    }

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      res.status(404).json({ message: "Order not found" });
      logger.warn(`Order with id ${orderId} not found`);
      return;
    }
    await Order.updateOne({ _id: orderId }, { $set: order.data });
    logger.info(`Updated order ${order.data.description}`);
    res.status(200).json({ message: "Order updated", data: order.data });
    return;
  } catch (err: unknown) {
    logger.error(`Error updating order: ${(err as Error).message}`);
    res.status(500).json({ message: "Internal server error", error: (err as Error).message });
    return;
  }
}
