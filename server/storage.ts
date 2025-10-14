import {
  type Client,
  type InsertClient,
  type Invoice,
  type InsertInvoice,
  type LineItem,
  type InsertLineItem,
  type CompanySettings,
  type InsertCompanySettings,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getClient(id: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  getInvoice(id: string): Promise<Invoice | undefined>;
  getAllInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;

  getLineItemsByInvoiceId(invoiceId: string): Promise<LineItem[]>;
  createLineItem(lineItem: InsertLineItem): Promise<LineItem>;
  updateLineItem(id: string, lineItem: Partial<InsertLineItem>): Promise<LineItem | undefined>;
  deleteLineItem(id: string): Promise<boolean>;
  deleteLineItemsByInvoiceId(invoiceId: string): Promise<void>;

  getCompanySettings(): Promise<CompanySettings | undefined>;
  createOrUpdateCompanySettings(settings: InsertCompanySettings): Promise<CompanySettings>;
}

export class MemStorage implements IStorage {
  private clients: Map<string, Client>;
  private invoices: Map<string, Invoice>;
  private lineItems: Map<string, LineItem>;
  private companySettings: CompanySettings | undefined;

  constructor() {
    this.clients = new Map();
    this.invoices = new Map();
    this.lineItems = new Map();
    
    const defaultSettings: CompanySettings = {
      id: randomUUID(),
      companyName: "Design Studio Inc.",
      email: "hello@designstudio.com",
      phone: "+1 (555) 123-4567",
      address: "123 Creative Ave, San Francisco, CA 94102",
      taxId: null,
      logo: null,
      primaryColor: "#3B82F6",
      invoicePrefix: "INV",
      nextInvoiceNumber: 1001,
    };
    this.companySettings = defaultSettings;

    const client1: Client = {
      id: randomUUID(),
      name: "Tech Corp",
      email: "contact@techcorp.com",
      address: "456 Business Blvd, New York, NY 10001",
      phone: "+1 (555) 234-5678",
      taxId: null,
    };
    const client2: Client = {
      id: randomUUID(),
      name: "Design Agency",
      email: "hello@designagency.com",
      address: "789 Creative Lane, Los Angeles, CA 90001",
      phone: "+1 (555) 345-6789",
      taxId: null,
    };
    this.clients.set(client1.id, client1);
    this.clients.set(client2.id, client2);
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = { 
      ...insertClient, 
      id,
      address: insertClient.address || null,
      phone: insertClient.phone || null,
      taxId: insertClient.taxId || null,
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updated = { ...client, ...updates };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = { 
      ...insertInvoice, 
      id,
      status: insertInvoice.status || "draft",
      currency: insertInvoice.currency || "USD",
      taxRate: insertInvoice.taxRate || "0",
      discount: insertInvoice.discount || "0",
      discountType: insertInvoice.discountType || "fixed",
      notes: insertInvoice.notes || null,
      template: insertInvoice.template || "modern",
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updated = { ...invoice, ...updates };
    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    await this.deleteLineItemsByInvoiceId(id);
    return this.invoices.delete(id);
  }

  async getLineItemsByInvoiceId(invoiceId: string): Promise<LineItem[]> {
    return Array.from(this.lineItems.values()).filter(
      (item) => item.invoiceId === invoiceId
    );
  }

  async createLineItem(insertLineItem: InsertLineItem): Promise<LineItem> {
    const id = randomUUID();
    const lineItem: LineItem = { 
      ...insertLineItem, 
      id,
      taxRate: insertLineItem.taxRate || "0",
      discount: insertLineItem.discount || "0",
      discountType: insertLineItem.discountType || "percentage",
    };
    this.lineItems.set(id, lineItem);
    return lineItem;
  }

  async updateLineItem(id: string, updates: Partial<InsertLineItem>): Promise<LineItem | undefined> {
    const lineItem = this.lineItems.get(id);
    if (!lineItem) return undefined;
    
    const updated = { ...lineItem, ...updates };
    this.lineItems.set(id, updated);
    return updated;
  }

  async deleteLineItem(id: string): Promise<boolean> {
    return this.lineItems.delete(id);
  }

  async deleteLineItemsByInvoiceId(invoiceId: string): Promise<void> {
    const items = await this.getLineItemsByInvoiceId(invoiceId);
    items.forEach((item) => this.lineItems.delete(item.id));
  }

  async getCompanySettings(): Promise<CompanySettings | undefined> {
    return this.companySettings;
  }

  async createOrUpdateCompanySettings(settings: InsertCompanySettings): Promise<CompanySettings> {
    if (this.companySettings) {
      this.companySettings = { ...this.companySettings, ...settings };
      return this.companySettings;
    } else {
      const id = randomUUID();
      const newSettings: CompanySettings = { 
        ...settings, 
        id,
        address: settings.address || null,
        phone: settings.phone || null,
        taxId: settings.taxId || null,
        logo: settings.logo || null,
        primaryColor: settings.primaryColor || "#3B82F6",
        invoicePrefix: settings.invoicePrefix || "INV",
        nextInvoiceNumber: settings.nextInvoiceNumber || 1001,
      };
      this.companySettings = newSettings;
      return newSettings;
    }
  }
}

export const storage = new MemStorage();
