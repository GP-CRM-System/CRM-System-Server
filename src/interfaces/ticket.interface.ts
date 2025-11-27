import mongoose from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";
import Contact from "../models/contact.model.js";

export const STicket = z.object({
  name: z
    .string("Ticket name is required")
    .min(3, "Ticket name must be at least 3 characters long")
    .max(50, "Ticket name must be at most 50 characters long")
    .regex(/^[a-zA-Z ]+$/, "Ticket name must contain only letters and spaces"),
  status: z
    .array(
      z.object({
        statusType: z.enum([
          "New",
          "Waiting on Contact",
          "Waiting on Employee",
          "Closed"
        ]),
        date: z.date()
      })
    )
    .default([{ statusType: "New", date: new Date() }]),
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
  priority: z.enum(["Low", "Medium", "High"]),
  contact: z.custom<mongoose.Types.ObjectId>(async (val) => {
    mongoose.Types.ObjectId.isValid(val as string);
    return await Contact.findById(val);
  }, "Contact is should be a valid contact"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type ITicket = z.infer<typeof STicket>;
