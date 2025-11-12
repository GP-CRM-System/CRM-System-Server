import express from "express";
import {
  createDeal,
  getAllDeals,
  getOneDeal,
  updateDeal
} from "../controllers/deal.controller.js";

const dealRouter = express.Router();

dealRouter.route("/").get(getAllDeals).post(createDeal);

dealRouter.route("/:id").get(getOneDeal).put(updateDeal);

export default dealRouter;
