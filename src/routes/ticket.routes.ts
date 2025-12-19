import express from "express";
import {
    addNewTicketStatus,
    createTicket,
    deleteTicket,
    getAllTickets,
    getOneTicket,
    updateTicket
} from "../controllers/ticket.controller.js";

const ticketRouter = express.Router();

ticketRouter.route("/").get(getAllTickets).post(createTicket);

ticketRouter
    .route("/:id")
    .get(getOneTicket)
    .put(updateTicket)
    .delete(deleteTicket);

ticketRouter.route("/:id/status").put(addNewTicketStatus);

export default ticketRouter;
