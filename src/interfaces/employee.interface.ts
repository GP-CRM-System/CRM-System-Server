import mongoose from "mongoose";
import { z } from "zod";
import Role from "../models/role.model.js";

export const SEmployee = z.object({
  fullName: z
    .string("Full name is required")
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name must be at most 50 characters long")
    .regex(/^[a-zA-Z ]+$/, "Full name must contain only letters and spaces"),
  phone: z
    .string("Phone number is required")
    .min(7, "Phone number must be at least 7 characters long")
    .max(14, "Phone number must be at most 14 characters long"),
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .nullable(),
  role: z
    .custom<mongoose.Types.ObjectId>(async (val) => {
      mongoose.Types.ObjectId.isValid(val as string);
      return await Role.findById(val);
    }, "Role is should be valid")
    .nullable(),
  salary: z
    .number("Salary is required")
    .gte(0, "Salary must be at least 0")
    .default(0),
  isActive: z.boolean().default(true),
  isModified: z
    .function({ input: [z.string()], output: z.boolean() })
    .readonly()
    .optional(),
  isNew: z.boolean().readonly().optional()
});

export type IEmployee = z.infer<typeof SEmployee>;
