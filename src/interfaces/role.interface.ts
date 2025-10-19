import mongoose from "mongoose";
import { z } from "zod";

const SRole = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  name: z.string().min(3).max(50),
  isActive: z.boolean().default(true),
  permissions: z.array(
    z.object({
      permName: z.enum([
        "Company",
        "Contact",
        "Employee",
        "Order",
        "Ticket",
        "Deal",
        "Role"
      ]),
      read: z.boolean().default(false),
      write: z.boolean().default(false)
    })
  )
});

export type IRole = z.infer<typeof SRole>;
