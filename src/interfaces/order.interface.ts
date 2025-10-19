import mongoose from "mongoose";
import { z } from "zod";

const SOrder = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  description: z.string().min(3).max(50),
  price: z.number().gt(0),
  ownerId: z.instanceof(mongoose.Types.ObjectId),
  stage: z.array(
    z.object({
      stageType: z
        .enum(["Open", "Processed", "Shipped", "Delivered", "Cancelled"])
        .default("Open"),
      date: z.date().default(new Date())
    })
  ),
  contactId: z.instanceof(mongoose.Types.ObjectId),
  employeeId: z.instanceof(mongoose.Types.ObjectId).nullable()
});

export type IOrder = z.infer<typeof SOrder>;
