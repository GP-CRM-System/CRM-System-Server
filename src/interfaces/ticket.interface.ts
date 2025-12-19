import mongoose from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";
import Contact from "../models/contact.model.js";
import Company from "../models/company.model.js";

export const STicket = z.object({
    name: z
        .string("Ticket name is required")
        .min(3, "Ticket name must be at least 3 characters long")
        .max(50, "Ticket name must be at most 50 characters long")
        .regex(
            /^[a-zA-Z ]+$/,
            "Ticket name must contain only letters and spaces"
        ),
    status: z.array(
        z.object({
            statusType: z.enum([
                "New",
                "Waiting on Contact",
                "Waiting on Employee",
                "Closed"
            ]),
            date: z.coerce.date()
        })
    ),
    description: z
        .string("Description is required")
        .min(3, "Description must be at least 3 characters long")
        .max(100, "Description must be at most 100 characters long")
        .regex(
            /^[a-zA-Z ,.]+$/,
            "Description must contain only letters, spaces, commas and periods"
        ),
    owner: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Employee.findById(val);
    }, "Owner is should be a valid employee"),
    source: z.enum(["Chat", "Email", "Phone", "Form"]),
    priority: z.enum(["Low", "Medium", "High", "Critical"]),
    contact: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Contact.findById(val);
    }, "Contact is should be a valid contact"),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().default(() => new Date()),

    //new fields
    category: z
        .enum(["Bug", "Question", "Request", "Billing", "Other"])
        .optional(),
    company: z
        .custom<mongoose.Types.ObjectId>(async (val) => {
            mongoose.Types.ObjectId.isValid(val as string);
            return await Company.findById(val);
        }, "Company is should be a valid company")
        .optional(),
    feedback: z.string().optional(),
    firstResponseDueDate: z.coerce.date().optional(),
    resolutionDueDate: z.coerce.date().optional(),
    resolutionStatus: z
        .enum(["Pending", "Solved", "Workaround", "Won't Fix"])
        .optional()
});

export type ITicket = z.infer<typeof STicket>;
