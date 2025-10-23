import express from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getOneRole,
  updateRole
} from "./controllers/role.controller.js";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getOneEmployee,
  updateEmployee
} from "./controllers/employee.controller.js";

const router = express.Router();

router.route("/roles").post(createRole).get(getAllRoles);

router.route("/roles/:id").get(getOneRole).put(updateRole).delete(deleteRole);

router.route("/employees").post(createEmployee).get(getAllEmployees);

router
  .route("/employees/:id")
  .get(getOneEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
