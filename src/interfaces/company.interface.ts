import mongoose from "mongoose";
import { z } from "zod";

export const SCompany = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  name: z.string().min(3).max(50),
  ownerId: z.instanceof(mongoose.Types.ObjectId),
  website: z.url().nullable(),
  email: z.email().nullable(),
  industry: z.enum(["IT", "Finance", "Healthcare", "Manufacturing"]), //Need to add more industries
  type: z.enum(["Public", "Private"]), //Need to add more types
  address: z.string(),
  numberOfEmployees: z.number().gt(0)
});

export type ICompany = z.infer<typeof SCompany>;
