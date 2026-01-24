import express from "express";
import { dashboard, healthCheck } from "../controllers/misc.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getOrderStatus } from "../controllers/order.controller.js";

const miscRouter = express.Router();

miscRouter.get("/health", isAuthenticated, healthCheck);
miscRouter.get("/dashboard", isAuthenticated, dashboard);
miscRouter.get("/order/:id/stage", getOrderStatus);

export default miscRouter;
