import {
  type Client,
  type InsertClient,
  type Invoice,
  type InsertInvoice,
  type LineItem,
  type InsertLineItem,
  type CompanySettings,
  type InsertCompanySettings,
  type User,
  type UpsertUser,
  users,
  clients,
  invoices,
  lineItems,
  companySettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Client operations
  getClient(id: string, userId: string): Promise<Client | undefined>;
  getAllClients(userId: string): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, userId: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string, userId: string): Promise<boolean>;

  // Invoice operations
  getInvoice(id: string, userId: string): Promise<Invoice | undefined>;
  getAllInvoices(userId: string): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, userId: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string, userId: string): Promise<boolean>;

  // Line item operations
  getLineItemsByInvoiceId(invoiceId: string): Promise<LineItem[]>;
  createLineItem(lineItem: InsertLineItem): Promise<LineItem>;
  updateLineItem(id: string, lineItem: Partial<InsertLineItem>): Promise<LineItem | undefined>;
  deleteLineItem(id: string): Promise<boolean>;
  deleteLineItemsByInvoiceId(invoiceId: string): Promise<void>;

  // Company settings operations
  getCompanySettings(userId: string, companyId?: string): Promise<CompanySettings | undefined>;
  getAllCompanySettings(userId: string): Promise<CompanySettings[]>;
  getPrimaryCompany(userId: string): Promise<CompanySettings | undefined>;
  createCompanySettings(userId: string, settings: InsertCompanySettings): Promise<CompanySettings>;
  updateCompanySettings(id: string, userId: string, settings: Partial<InsertCompanySettings>): Promise<CompanySettings | undefined>;
  deleteCompanySettings(id: string, userId: string): Promise<boolean>;
  setPrimaryCompany(id: string, userId: string): Promise<CompanySettings | undefined>;
  createOrUpdateCompanySettings(userId: string, settings: InsertCompanySettings): Promise<CompanySettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Client operations
  async getClient(id: string, userId: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, userId)));
    return client;
  }

  async getAllClients(userId: string): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.userId, userId));
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: string, userId: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db
      .update(clients)
      .set(updates)
      .where(and(eq(clients.id, id), eq(clients.userId, userId)))
      .returning();
    return client;
  }

  async deleteClient(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Invoice operations
  async getInvoice(id: string, userId: string): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
    return invoice;
  }

  async getAllInvoices(userId: string): Promise<Invoice[]> {
    return db.select().from(invoices).where(eq(invoices.userId, userId));
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async updateInvoice(id: string, userId: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const [invoice] = await db
      .update(invoices)
      .set(updates)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
      .returning();
    return invoice;
  }

  async deleteInvoice(id: string, userId: string): Promise<boolean> {
    await this.deleteLineItemsByInvoiceId(id);
    const result = await db
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Line item operations
  async getLineItemsByInvoiceId(invoiceId: string): Promise<LineItem[]> {
    return db.select().from(lineItems).where(eq(lineItems.invoiceId, invoiceId));
  }

  async createLineItem(insertLineItem: InsertLineItem): Promise<LineItem> {
    const [lineItem] = await db.insert(lineItems).values(insertLineItem).returning();
    return lineItem;
  }

  async updateLineItem(id: string, updates: Partial<InsertLineItem>): Promise<LineItem | undefined> {
    const [lineItem] = await db
      .update(lineItems)
      .set(updates)
      .where(eq(lineItems.id, id))
      .returning();
    return lineItem;
  }

  async deleteLineItem(id: string): Promise<boolean> {
    const result = await db.delete(lineItems).where(eq(lineItems.id, id)).returning();
    return result.length > 0;
  }

  async deleteLineItemsByInvoiceId(invoiceId: string): Promise<void> {
    await db.delete(lineItems).where(eq(lineItems.invoiceId, invoiceId));
  }

  // Company settings operations
  async getCompanySettings(userId: string, companyId?: string): Promise<CompanySettings | undefined> {
    if (companyId) {
      const [settings] = await db
        .select()
        .from(companySettings)
        .where(and(eq(companySettings.id, companyId), eq(companySettings.userId, userId)))
        .limit(1);
      return settings;
    }
    // Return primary company if no specific ID provided
    return this.getPrimaryCompany(userId);
  }

  async getAllCompanySettings(userId: string): Promise<CompanySettings[]> {
    return db
      .select()
      .from(companySettings)
      .where(and(eq(companySettings.userId, userId), eq(companySettings.isActive, "true")));
  }

  async getPrimaryCompany(userId: string): Promise<CompanySettings | undefined> {
    const [settings] = await db
      .select()
      .from(companySettings)
      .where(and(
        eq(companySettings.userId, userId),
        eq(companySettings.isPrimary, "true"),
        eq(companySettings.isActive, "true")
      ))
      .limit(1);
    
    // If no primary company, return the first active one
    if (!settings) {
      const [firstActive] = await db
        .select()
        .from(companySettings)
        .where(and(eq(companySettings.userId, userId), eq(companySettings.isActive, "true")))
        .limit(1);
      return firstActive;
    }
    
    return settings;
  }

  async createCompanySettings(userId: string, settings: InsertCompanySettings): Promise<CompanySettings> {
    // Check if this should be the primary company
    const existingCompanies = await this.getAllCompanySettings(userId);
    const isPrimary = existingCompanies.length === 0 ? "true" : (settings as any).isPrimary || "false";
    
    // If setting as primary, unset all other primary companies
    if (isPrimary === "true") {
      await db
        .update(companySettings)
        .set({ isPrimary: "false" })
        .where(eq(companySettings.userId, userId));
    }
    
    const [created] = await db
      .insert(companySettings)
      .values({ ...settings, userId, isPrimary, isActive: "true" })
      .returning();
    return created;
  }

  async updateCompanySettings(id: string, userId: string, settings: Partial<InsertCompanySettings>): Promise<CompanySettings | undefined> {
    // If setting as primary, unset all other primary companies
    if ((settings as any).isPrimary === "true") {
      await db
        .update(companySettings)
        .set({ isPrimary: "false" })
        .where(and(eq(companySettings.userId, userId), eq(companySettings.isActive, "true")));
    }
    
    const [updated] = await db
      .update(companySettings)
      .set(settings)
      .where(and(eq(companySettings.id, id), eq(companySettings.userId, userId)))
      .returning();
    return updated;
  }

  async deleteCompanySettings(id: string, userId: string): Promise<boolean> {
    // Soft delete by setting isActive to false
    const [deleted] = await db
      .update(companySettings)
      .set({ isActive: "false" })
      .where(and(eq(companySettings.id, id), eq(companySettings.userId, userId)))
      .returning();
    
    // If deleted company was primary, set another company as primary
    if (deleted && deleted.isPrimary === "true") {
      const [firstActive] = await db
        .select()
        .from(companySettings)
        .where(and(eq(companySettings.userId, userId), eq(companySettings.isActive, "true")))
        .limit(1);
      
      if (firstActive) {
        await db
          .update(companySettings)
          .set({ isPrimary: "true" })
          .where(eq(companySettings.id, firstActive.id));
      }
    }
    
    return !!deleted;
  }

  async setPrimaryCompany(id: string, userId: string): Promise<CompanySettings | undefined> {
    // Unset all other primary companies
    await db
      .update(companySettings)
      .set({ isPrimary: "false" })
      .where(eq(companySettings.userId, userId));
    
    // Set the new primary company
    const [updated] = await db
      .update(companySettings)
      .set({ isPrimary: "true" })
      .where(and(eq(companySettings.id, id), eq(companySettings.userId, userId)))
      .returning();
    return updated;
  }

  // Legacy method for backward compatibility
  async createOrUpdateCompanySettings(userId: string, settings: InsertCompanySettings): Promise<CompanySettings> {
    const primaryCompany = await this.getPrimaryCompany(userId);
    
    if (primaryCompany) {
      const [updated] = await db
        .update(companySettings)
        .set(settings)
        .where(eq(companySettings.id, primaryCompany.id))
        .returning();
      return updated;
    } else {
      return this.createCompanySettings(userId, settings);
    }
  }
}

export const storage = new DatabaseStorage();
