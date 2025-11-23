import mongoose from "mongoose";
import { z } from "zod";
import Employee from "../models/employee.model.js";

export const SContact = z.object({
  name: z
    .string("Contact name is required")
    .min(3, "Contact name must be at least 3 characters long")
    .max(50, "Contact name must be at most 50 characters long")
    .regex(/^[a-zA-Z ]+$/, "Contact name must contain only letters and spaces"),
  email: z.email("Invalid email").nullable(),
  phone: z
    .string("Invalid phone")
    .min(7, "Phone must be at least 7 characters long")
    .max(14, "Phone must be at most 14 characters long")
    .nullable(),
  address: z
    .string("Address is required")
    .min(3, "Address must be at least 3 characters long")
    .max(100, "Address must be at most 100 characters long")
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Address must contain only letters, numbers and spaces"
    )
    .nullable(),
  jobTitle: z
    .string("Invalid job title")
    .min(3, "Job title must be at least 3 characters long")
    .max(50, "Job title must be at most 50 characters long")
    .regex(/^[a-zA-Z ]+$/, "Job title must contain only letters and spaces")
    .nullable(),
  owner: z.custom<mongoose.Types.ObjectId>(async (val) => {
    mongoose.Types.ObjectId.isValid(val as string);
    return await Employee.findById(val);
  }, "Owner is should be a valid employee"),
  stage: z
    .array(
      z.object({
        name: z.enum(["Lead", "Customer"]),
        date: z.date().default(new Date())
      })
    )
    .default([{ name: "Lead", date: new Date() }]),
  isActive: z.boolean().default(true)
});

export type IContact = z.infer<typeof SContact>;
