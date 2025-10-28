import mongoose from "mongoose";
import { z } from "zod";

export const SOrder = z.object({
  description: z.string().min(3).max(50),
  price: z.number().gt(0),
  owner: z.custom<mongoose.Types.ObjectId>((val) => mongoose.Types.ObjectId.isValid(val as string)),
  stage: z.array(
    z.object({
      stageType: z
        .enum(["Open", "Processed", "Shipped", "Delivered", "Cancelled"]),
      date: z.date()
    })
  ).default([{ stageType: "Open", date: new Date() }]),
  contact: z.custom<mongoose.Types.ObjectId>((val) => mongoose.Types.ObjectId.isValid(val as string)),
  employee: z.custom<mongoose.Types.ObjectId>((val) => mongoose.Types.ObjectId.isValid(val as string))
});

export type IOrder = z.infer<typeof SOrder>;
