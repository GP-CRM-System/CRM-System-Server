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
    source: {
        type: String,
        enum: ["Chat", "Email", "Phone", "Form"],
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        required: true
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Contact"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    //new fields
    category: {
        type: String,
        enum: ["Bug", "Question", "Request", "Billing", "Other"],
        default: "Other"
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    feedback: String,
    firstResponseDueDate: Date,
    resolutionDueDate: Date,
    resolutionStatus: {
        type: String,
        enum: ["Pending", "Solved", "Workaround", "Won't Fix"],
        default: "Pending"
    }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
