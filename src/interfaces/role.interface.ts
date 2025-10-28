import { z } from "zod";

export const SRole = z.object({
  name: z.string().min(3).max(50),
  isActive: z.boolean().default(true),
  Company: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean()
  }).default({ read: false, write: false, delete: false }),
  Employee: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean()
  }).default({ read: false, write: false, delete: false }),
  Contact: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean()
  }).default({ read: false, write: false, delete: false }),
  Deal: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean()
  }).default({ read: false, write: false, delete: false }),
  Role: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean()
  }).default({ read: false, write: false, delete: false }),
  Order: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean()
  }).default({ read: false, write: false, delete: false }),
  Ticket: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean()
  }).default({ read: false, write: false, delete: false })
});

export type IRole = z.infer<typeof SRole>;
