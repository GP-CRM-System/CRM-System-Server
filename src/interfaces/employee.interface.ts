import mongoose from "mongoose";
import { z } from "zod";

export const SEmployee = z.object({
  fullName: z.string().min(3).max(50),
  phone: z.string().min(7).max(14),
  email: z.email(),
  password: z.string().min(8).max(64).nullable(),
  role: z.custom<mongoose.Types.ObjectId>((val) =>
    mongoose.Types.ObjectId.isValid(val as string)
  ),
  salary: z.number().gte(0).default(0),
  isActive: z.boolean().default(false),
  isModified: z
    .function({ input: [z.string()], output: z.boolean() })
    .readonly()
    .optional(),
  isNew: z.boolean().readonly().optional()
});

export type IEmployee = z.infer<typeof SEmployee>;
