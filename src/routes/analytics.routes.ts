import express from "express";
import {
    getCards,
    getLeadConversions,
    getProductPerformance,
    getRevenueTrends,
    getTicketStatuses
} from "../controllers/analytics.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/cards", getCards);
analyticsRouter.get("/revenue", getRevenueTrends);
analyticsRouter.get("/tickets", getTicketStatuses);
analyticsRouter.get("/products", getProductPerformance);
analyticsRouter.get("/leads", getLeadConversions);

export default analyticsRouter;
