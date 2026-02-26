import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  contactEmail: z.string().email().optional(),
  password: z.string().min(8).max(72),
  role: z.enum(["OWNER", "DEALER", "WORKSHOP"]),
  name: z.string().min(2).max(80).optional(),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(24)
    .regex(/^[0-9+\s()-]+$/)
    .optional(),
  whatsapp: z
    .string()
    .trim()
    .min(8)
    .max(24)
    .regex(/^[0-9+\s()-]+$/)
    .optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
