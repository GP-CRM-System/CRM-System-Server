import mongoose from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";
import Contact from "../models/contact.model.js";

export const SOrder = z.object({
  description: z
    .string("Description is required")
    .min(3, "Description must be at least 3 characters long")
    .max(100, "Description must be at most 100 characters long")
    .regex(
      /^[a-zA-Z ,.]+$/,
      "Description must contain only letters, spaces, commas and periods"
    ),
  price: z.number("Price is required").gt(0, "Price must be greater than 0"),
  owner: z.custom<mongoose.Types.ObjectId>(async (val) => {
    mongoose.Types.ObjectId.isValid(val as string);
    return await Employee.findById(val);
  }, "Owner is should be a valid employee"),
  stage: z
    .array(
      z.object({
        stageType: z.enum([
          "Open",
          "Processed",
          "Shipped",
          "Delivered",
          "Cancelled"
        ]),
        date: z.date()
      })
    )
    .default([{ stageType: "Open", date: new Date() }]),
  contact: z.custom<mongoose.Types.ObjectId>(async (val) => {
    mongoose.Types.ObjectId.isValid(val as string);
    return await Contact.findById(val);
  }, "Contact is should be a valid contact"),
  employee: z.custom<mongoose.Types.ObjectId>(async (val) => {
    mongoose.Types.ObjectId.isValid(val as string);
    return await Employee.findById(val);
  }, "Employee is should be a valid employee")
});

export type IOrder = z.infer<typeof SOrder>;
