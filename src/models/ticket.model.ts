import mongoose from "mongoose";
import type { ITicket } from "../interfaces/ticket.interface.js";

const ticketSchema = new mongoose.Schema<ITicket>({
  name: { type: String, required: true },
  status: [
    {
      statusType: { type: String, required: true },
      date: { type: Date, required: true, default: new Date() }
    }
  ],
  description: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee"
  },
  source: { type: String, required: true },
  priority: { type: String, required: true },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Contact"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
