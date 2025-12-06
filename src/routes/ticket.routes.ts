import express from "express";
import {
  addNewTicketStatus,
  createTicket,
  getAllTickets,
  getOneTicket,
  updateTicket
} from "../controllers/ticket.controller.js";

const ticketRouter = express.Router();

ticketRouter.route("/").get(getAllTickets).post(createTicket);

ticketRouter.route("/:id").get(getOneTicket).put(updateTicket);

ticketRouter.route("/:id/status").put(addNewTicketStatus);

export default ticketRouter;
