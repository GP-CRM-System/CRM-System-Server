import mongoose from "mongoose";
import { z } from "zod";

export const SDeal = z.object({
  name: z.string().min(3).max(50),
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
  amount: z.number().gt(0),
  owner: z.custom<mongoose.Types.ObjectId>((val) =>
    mongoose.Types.ObjectId.isValid(val as string)
  ),
  priority: z.enum(["Low", "Medium", "High"]),
  contact: z.custom<mongoose.Types.ObjectId>((val) =>
    mongoose.Types.ObjectId.isValid(val as string)
  ),
  company: z
    .custom<mongoose.Types.ObjectId>((val) =>
      mongoose.Types.ObjectId.isValid(val as string)
    )
    .optional()
});

export type IDeal = z.infer<typeof SDeal>;
