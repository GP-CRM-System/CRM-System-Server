import express from "express";
import { createRole } from "./controllers/role.controller.js";

const router = express.Router();

router.route("/roles")
  .post(createRole);

export default router;