import express from "express";
import {
  createTicket,
  getAllTickets,
  getOneTicket,
  updateTicket
} from "../controllers/ticket.controller.js";

const ticketRouter = express.Router();

ticketRouter.route("/").get(getAllTickets).post(createTicket);

ticketRouter.route("/:id").get(getOneTicket).put(updateTicket);

export default ticketRouter;
