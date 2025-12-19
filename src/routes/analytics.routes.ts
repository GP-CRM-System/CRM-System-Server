import express from "express";
import {
    getCards,
    getLeadConversions,
    getProductPerformance,
    getRevenueTrends,
    getTicketStatuses
} from "../controllers/analytics.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const analyticsRouter = express.Router();

analyticsRouter.use(isAuthenticated);

analyticsRouter.get("/cards", getCards);
analyticsRouter.get("/revenue", getRevenueTrends);
analyticsRouter.get("/tickets", getTicketStatuses);
analyticsRouter.get("/products", getProductPerformance);
analyticsRouter.get("/leads", getLeadConversions);

export default analyticsRouter;
