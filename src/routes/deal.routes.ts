import express from "express";
import {
    addNewDealStage,
    createDeal,
    deleteDeal,
    getAllDeals,
    getOneDeal,
    updateDeal
} from "../controllers/deal.controller.js";

const dealRouter = express.Router();

dealRouter.route("/").get(getAllDeals).post(createDeal);

dealRouter.route("/:id").get(getOneDeal).put(updateDeal).delete(deleteDeal);

dealRouter.route("/:id/stage").put(addNewDealStage);

export default dealRouter;
