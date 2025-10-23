import { z } from "zod";

export const SResponse = z.object({
  message: z.string(),
  error: z.string().optional(),
  data: z.any().optional()
});

export type IResponse = z.infer<typeof SResponse>;
