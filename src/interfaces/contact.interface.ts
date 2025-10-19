import mongoose from "mongoose";
import { z } from "zod";

const SContact = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  name: z.string().min(3).max(50),
  email: z.email().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  jobTitle: z.string().nullable(),
  ownerId: z.instanceof(mongoose.Types.ObjectId),
  stage: z
    .array(
      z.object({
        name: z.enum(["Lead", "Customer"]),
        date: z.date().default(new Date())
      })
    )
    .default([{ name: "Lead", date: new Date() }])
});

export type IContact = z.infer<typeof SContact>;
