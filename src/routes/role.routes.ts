import express from "express";

import {
    createRole,
    deleteRole,
    getAllRoles,
    getOneRole,
    updateRole
} from "../controllers/role.controller.js";

const roleRouter = express.Router();

roleRouter.route("/").post(createRole).get(getAllRoles);

roleRouter.route("/:id").get(getOneRole).put(updateRole).delete(deleteRole);

export default roleRouter;
