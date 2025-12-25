import express from "express";

import {
    createEmployee,
    deactivateEmployee,
    getAllEmployees,
    getOneEmployee,
    updateEmployee,
    inviteEmployee
} from "../controllers/employee.controller.js";

const employeeRouter = express.Router();

employeeRouter.route("/").post(createEmployee).get(getAllEmployees);
employeeRouter.post("/invite", inviteEmployee);

employeeRouter
    .route("/:id")
    .get(getOneEmployee)
    .put(updateEmployee)
    .delete(deactivateEmployee);

export default employeeRouter;
