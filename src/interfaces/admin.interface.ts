import mongoose from "mongoose";
import { z } from "zod";
import { industries } from "./company.interface.js";

export const SRegister = z.object({
  fullName: z.string().min(3).max(50),
  phone: z.string().min(7).max(14),
  email: z.email(),
  password: z.string().min(8).max(64).nullable(),
  role: z.custom<mongoose.Types.ObjectId>((val) =>
    mongoose.Types.ObjectId.isValid(val as string)
  ),
  companyName: z.string().min(3).max(50),
  numberOfEmployees: z.number().gt(0),
  industry: z.enum(industries),
  companyPhone: z.string().min(7).max(14)
});

export type IAdmin = z.infer<typeof SRegister>;
