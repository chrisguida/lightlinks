import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User mapping table
export const userMappings = pgTable("user_mappings", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  npub: text("npub").notNull().unique(),
});

// Create insert schema for user mappings
export const insertUserSchema = createInsertSchema(userMappings).pick({
  username: true,
  npub: true,
});

// Validate shipping info based on delivery type
export const shippingInfoSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional()
});

export const deliveryTypeSchema = z.enum(["no_info", "email_only", "shipping_info"]);

// Ad schema matching NIP-99 kind 30402
export const adSchema = z.object({
  id: z.string(),
  pubkey: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  images: z.array(z.string()).optional(),
  deliveryType: deliveryTypeSchema,
  discount: z.number().optional(),
  relayUrl: z.string()
});

// Affiliate link schema for kind 13166
export const affiliateLinkSchema = z.object({
  id: z.string(),
  pubkey: z.string(),
  adEventId: z.string(),
  relayUrl: z.string()
});

export type UserMapping = typeof userMappings.$inferSelect;
export type InsertUserMapping = z.infer<typeof insertUserSchema>;
export type ShippingInfo = z.infer<typeof shippingInfoSchema>;
export type DeliveryType = z.infer<typeof deliveryTypeSchema>;
export type Ad = z.infer<typeof adSchema>;
export type AffiliateLink = z.infer<typeof affiliateLinkSchema>;