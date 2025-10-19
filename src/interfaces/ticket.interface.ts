import mongoose from "mongoose";
import { z } from "zod";

const STicket = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  name: z.string().min(3).max(50),
  status: z.array(
    z.object({
      statusType: z
        .enum(["New", "Waiting on Contact", "Waiting on Employee", "Closed"])
        .default("New"),
      date: z.date().default(new Date())
    })
  ),
  description: z.string().min(3).max(50),
  ownerId: z.instanceof(mongoose.Types.ObjectId),
  source: z.enum(["Chat", "Email", "Phone", "Form"]),
  priority: z.enum(["Low", "Medium", "High"]),
  contactId: z.instanceof(mongoose.Types.ObjectId)
});

export type ITicket = z.infer<typeof STicket>;
