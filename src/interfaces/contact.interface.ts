import mongoose from "mongoose";
import { z } from "zod";

export const SContact = z.object({
  name: z.string().min(3).max(50),
  email: z.email().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  jobTitle: z.string().nullable(),
  owner: z.custom<mongoose.Types.ObjectId>((val) =>
    mongoose.Types.ObjectId.isValid(val as string)
  ),
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
