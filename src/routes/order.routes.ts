import express from "express";
import {
  createOrder,
  getAllOrders,
  getOneOrder,
  updateOrder
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.route("/").get(getAllOrders).post(createOrder);

orderRouter.route("/:id").get(getOneOrder).put(updateOrder);

export default orderRouter;
