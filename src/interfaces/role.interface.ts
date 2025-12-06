import { z } from "zod";

export const SRole = z.object({
  name: z
    .string("Role name is required")
    .min(3, "Role name must be at least 3 characters long")
    .max(50, "Role name must be at most 50 characters long")
    .regex(/^[a-zA-Z ]+$/, "Role name must contain only letters and spaces"),
  isActive: z.boolean().default(true),
  Company: z
    .object({ read: z.boolean(), write: z.boolean(), delete: z.boolean() })
    .default({ read: false, write: false, delete: false }),
  Employee: z
    .object({ read: z.boolean(), write: z.boolean(), delete: z.boolean() })
    .default({ read: false, write: false, delete: false }),
  Contact: z
    .object({ read: z.boolean(), write: z.boolean(), delete: z.boolean() })
    .default({ read: false, write: false, delete: false }),
  Deal: z
    .object({ read: z.boolean(), write: z.boolean(), delete: z.boolean() })
    .default({ read: false, write: false, delete: false }),
  Role: z
    .object({ read: z.boolean(), write: z.boolean(), delete: z.boolean() })
    .default({ read: false, write: false, delete: false }),
  Order: z
    .object({ read: z.boolean(), write: z.boolean(), delete: z.boolean() })
    .default({ read: false, write: false, delete: false }),
  Ticket: z
    .object({ read: z.boolean(), write: z.boolean(), delete: z.boolean() })
    .default({ read: false, write: false, delete: false }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type IRole = z.infer<typeof SRole>;
