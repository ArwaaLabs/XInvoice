import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  address: text("address"),
  phone: text("phone"),
  taxId: text("tax_id"),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  clientId: varchar("client_id").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  currency: text("currency").notNull().default("USD"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  discountType: text("discount_type").default("fixed"),
  notes: text("notes"),
  status: text("status").notNull().default("draft"),
  template: text("template").default("modern"),
});

export const lineItems = pgTable("line_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  discountType: text("discount_type").default("percentage"),
});

export const companySettings = pgTable("company_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  taxId: text("tax_id"),
  logo: text("logo"),
  primaryColor: text("primary_color").default("#3B82F6"),
  invoicePrefix: text("invoice_prefix").default("INV"),
  nextInvoiceNumber: integer("next_invoice_number").default(1001),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true });
export const insertInvoiceSchema = createInsertSchema(invoices, {
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
}).omit({ id: true });
export const insertLineItemSchema = createInsertSchema(lineItems).omit({ id: true });
export const insertCompanySettingsSchema = createInsertSchema(companySettings).omit({ id: true });

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type LineItem = typeof lineItems.$inferSelect;
export type InsertLineItem = z.infer<typeof insertLineItemSchema>;
export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;
