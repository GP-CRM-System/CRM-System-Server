import { z } from "zod";

export const SEmployee = z.object({
  fullName: z.string().min(3).max(50),
  phone: z.string().min(8).max(15),
  email: z.email(),
  password: z.string().min(8).max(64).nullable(),
  roleId: z.string().min(24).max(24),
  salary: z.number().gte(0).default(0),
  isActive: z.boolean().default(false)
});

export type IEmployee = z.infer<typeof SEmployee>;
