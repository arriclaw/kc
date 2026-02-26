import { z } from "zod";
export * from "./auth";

export const roleSchema = z.enum(["OWNER", "DEALER", "WORKSHOP", "ADMIN"]);
export const sourceKindSchema = z.enum(["SELF_DECLARED", "DEALER_ENTERED", "WORKSHOP_ENTERED", "THIRD_PARTY"]);
export const verificationStatusSchema = z.enum(["UNVERIFIED", "VERIFIED"]);
export const eventTypeSchema = z.enum([
  "ODOMETER",
  "SERVICE",
  "REPAIR",
  "ACCIDENT",
  "INSPECTION",
  "OTHER",
  "CORRECTION"
]);

export const createVehicleSchema = z.object({
  plate: z.string().trim().min(5).max(12),
  country: z.string().trim().default("UY"),
  make: z.string().trim().min(2).max(40),
  model: z.string().trim().min(1).max(40),
  year: z.number().int().min(1950).max(2100)
});

export const createEventSchema = z.object({
  type: eventTypeSchema,
  occurredAt: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  odometerKm: z.number().int().min(0).nullable().optional(),
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(3).max(2000),
  cost: z.number().min(0).nullable().optional(),
  location: z.string().trim().max(120).optional(),
  sourceKind: sourceKindSchema.default("SELF_DECLARED"),
  verificationStatus: verificationStatusSchema.default("UNVERIFIED"),
  correctionOfEventId: z.string().uuid().nullable().optional()
});

export const createShareLinkSchema = z.object({
  visibility: z.enum(["PUBLIC_SUMMARY", "FULL_HISTORY"]).default("PUBLIC_SUMMARY"),
  expiresAt: z.string().datetime({ offset: true }).optional()
});

export const transferVehicleSchema = z.object({
  targetUserId: z.string().uuid()
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(190),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(24)
    .regex(/^[0-9+\s()-]+$/)
    .optional(),
  requesterType: z.enum(["PARTICULAR", "AUTOMOTORA", "COMPRADOR", "OTRO"]).default("OTRO"),
  subject: z.string().trim().min(4).max(120),
  message: z.string().trim().min(15).max(3000)
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;
export type TransferVehicleInput = z.infer<typeof transferVehicleSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
