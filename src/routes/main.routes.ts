import express from "express";

import roleRouter from "./role.routes.js";
import employeeRouter from "./employee.routes.js";
import contactRouter from "./contact.routes.js";
import companyRouter from "./company.routes.js";
import dealRouter from "./deal.routes.js";
import orderRouter from "./order.routes.js";
import ticketRouter from "./ticket.routes.js";
import miscRouter from "./misc.routes.js";
import authRouter from "./auth.routes.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/companies", isAuthenticated, companyRouter);
router.use("/contacts", isAuthenticated, contactRouter);
router.use("/deals", isAuthenticated, dealRouter);
router.use("/employees", isAuthenticated, employeeRouter);
router.use("/orders", isAuthenticated, orderRouter);
router.use("/roles", isAuthenticated, roleRouter);
router.use("/tickets", isAuthenticated, ticketRouter);
router.use(miscRouter);

export default router;
