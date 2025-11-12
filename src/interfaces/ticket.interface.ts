import mongoose from "mongoose";
import { z } from "zod";

export const STicket = z.object({
  name: z.string().min(3).max(50),
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
  description: z.string().min(3).max(50),
  owner: z.custom<mongoose.Types.ObjectId>((val) =>
    mongoose.Types.ObjectId.isValid(val as string)
  ),
  source: z.enum(["Chat", "Email", "Phone", "Form"]),
  priority: z.enum(["Low", "Medium", "High"]),
  contact: z.custom<mongoose.Types.ObjectId>((val) =>
    mongoose.Types.ObjectId.isValid(val as string)
  )
});

export type ITicket = z.infer<typeof STicket>;
