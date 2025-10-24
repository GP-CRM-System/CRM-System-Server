import express from "express";

import roleRouter from "./role.routes.js";
import employeeRouter from "./employee.routes.js";
import contactRouter from "./contact.routes.js";
import companyRouter from "./company.routes.js";

const router = express.Router();

router.use("/roles", roleRouter);
router.use("/employees", employeeRouter);
router.use("/contacts", contactRouter);
router.use("/companies", companyRouter);

export default router;
