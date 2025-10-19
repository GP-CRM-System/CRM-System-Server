import mongoose from "mongoose";
import { z } from "zod";

const SDeal = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
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
        .default("Appointment Scheduled"),
      date: z.date().default(new Date())
    })
  ),
  amount: z.number().gt(0),
  ownerId: z.instanceof(mongoose.Types.ObjectId),
  priority: z.enum(["Low", "Medium", "High"]),
  contactId: z.instanceof(mongoose.Types.ObjectId),
  companyId: z.instanceof(mongoose.Types.ObjectId).nullable()
});

export type IDeal = z.infer<typeof SDeal>;
