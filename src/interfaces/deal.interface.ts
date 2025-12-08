import mongoose from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";
import Contact from "../models/contact.model.js";
import Company from "../models/company.model.js";

export const SDeal = z.object({
    name: z
        .string("Deal name is required")
        .min(3, "Deal name must be at least 3 characters long")
        .max(50, "Deal name must be at most 50 characters long")
        .regex(
            /^[a-zA-Z ]+$/,
            "Deal name must contain only letters and spaces"
        ),

    stage: z
        .array(
            z.object({
                name: z.enum([
                    "Appointment Scheduled",
                    "Qualified To Buy",
                    "Presentation Scheduled",
                    "Decision Maker Bought-In",
                    "Contract Sent",
                    "Closed Won",
                    "Closed Lost"
                ]),
                date: z.date()
            })
        )
        .default([{ name: "Appointment Scheduled", date: new Date() }]),

    amount: z
        .number("Amount is required")
        .gt(0, "Amount must be greater than 0"),
    owner: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Employee.findById(val);
    }, "Owner is should be a valid employee"),

    priority: z.enum(["Low", "Medium", "High"], "Invalid priority"),
    contact: z.custom<mongoose.Types.ObjectId>(async (val) => {
        mongoose.Types.ObjectId.isValid(val as string);
        return await Contact.findById(val);
    }, "Contact is should be a valid contact"),
    company: z
        .custom<mongoose.Types.ObjectId>(async (val) => {
            mongoose.Types.ObjectId.isValid(val as string);
            return await Company.findById(val);
        }, "Company is should be a valid company")
        .optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type IDeal = z.infer<typeof SDeal>;
