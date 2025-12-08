import express from "express";
import {
    createCompany,
    deactivateCompany,
    getAllCompanies,
    getOneCompany,
    updateCompany
} from "../controllers/company.controller.js";

const companyRouter = express.Router();

companyRouter.route("/").get(getAllCompanies).post(createCompany);

companyRouter
    .route("/:id")
    .get(getOneCompany)
    .put(updateCompany)
    .delete(deactivateCompany);

export default companyRouter;
