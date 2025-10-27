import mongoose from "mongoose";
import { z } from "zod";

export const SDeal = z.object({
  name: z.string().min(3).max(50),
  stage: z.array(
    z.object({
      name: z
        .enum([
          "Appointment Scheduled",
          "Qualified To Buy",
          "Presentation Scheduled",
          "Decision Maker Bought-In",
          "Contract Sent",
          "Closed Won",
          "Closed Lost"
        ])
      ,
      date: z.date(),
    })
  ).default([{ name: "Appointment Scheduled", date: new Date() }]),
  amount: z.number().gt(0),
  ownerId: z.custom<mongoose.Types.ObjectId>((val) => mongoose.Types.ObjectId.isValid(val as string)),
  priority: z.enum(["Low", "Medium", "High"]),
  contactId: z.custom<mongoose.Types.ObjectId>((val) => mongoose.Types.ObjectId.isValid(val as string)),
  companyId: z.custom<mongoose.Types.ObjectId>((val) => mongoose.Types.ObjectId.isValid(val as string))
});

export type IDeal = z.infer<typeof SDeal>;
