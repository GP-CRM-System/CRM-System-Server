import express from "express";
import {
    addNewOrderStage,
    createOrder,
    deleteOrder,
    getAllOrders,
    getOneOrder,
    updateOrder,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.route("/").get(getAllOrders).post(createOrder);

orderRouter.route("/:id").get(getOneOrder).put(updateOrder).delete(deleteOrder);

orderRouter.route("/:id/stage").put(addNewOrderStage);

export default orderRouter;
