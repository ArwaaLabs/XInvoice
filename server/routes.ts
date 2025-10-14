import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertInvoiceSchema, insertLineItemSchema, insertCompanySettingsSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication first
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Client routes - all protected
  app.get("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clients = await storage.getAllClients(userId);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const client = await storage.getClient(req.params.id, userId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertClientSchema.parse({ ...req.body, userId });
      const client = await storage.createClient(data);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.patch("/api/clients/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, userId, data);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deleteClient(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Invoice routes - all protected
  app.get("/api/invoices", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoices = await storage.getAllInvoices(userId);
      const invoicesWithItems = await Promise.all(
        invoices.map(async (invoice) => {
          const items = await storage.getLineItemsByInvoiceId(invoice.id);
          return { ...invoice, items };
        })
      );
      res.json(invoicesWithItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoice = await storage.getInvoice(req.params.id, userId);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      const items = await storage.getLineItemsByInvoiceId(invoice.id);
      res.json({ ...invoice, items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { items, ...invoiceData } = req.body;
      const invoiceInput = insertInvoiceSchema.parse({ ...invoiceData, userId });
      
      const invoice = await storage.createInvoice(invoiceInput);
      
      const createdItems = [];
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const itemData = insertLineItemSchema.parse({
            ...item,
            invoiceId: invoice.id,
          });
          const createdItem = await storage.createLineItem(itemData);
          createdItems.push(createdItem);
        }
      }
      
      res.status(201).json({ ...invoice, items: createdItems });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });

  app.patch("/api/invoices/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { items, ...invoiceData } = req.body;
      
      let invoice;
      if (Object.keys(invoiceData).length > 0) {
        const invoiceInput = insertInvoiceSchema.partial().parse(invoiceData);
        invoice = await storage.updateInvoice(req.params.id, userId, invoiceInput);
        if (!invoice) {
          return res.status(404).json({ error: "Invoice not found" });
        }
      } else {
        invoice = await storage.getInvoice(req.params.id, userId);
        if (!invoice) {
          return res.status(404).json({ error: "Invoice not found" });
        }
      }

      if (items && Array.isArray(items)) {
        await storage.deleteLineItemsByInvoiceId(req.params.id);
        
        const createdItems = [];
        for (const item of items) {
          const itemData = insertLineItemSchema.parse({
            ...item,
            invoiceId: req.params.id,
          });
          const createdItem = await storage.createLineItem(itemData);
          createdItems.push(createdItem);
        }
        
        res.json({ ...invoice, items: createdItems });
      } else {
        const existingItems = await storage.getLineItemsByInvoiceId(req.params.id);
        res.json({ ...invoice, items: existingItems });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update invoice" });
    }
  });

  app.delete("/api/invoices/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deleteInvoice(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  });

  // Settings routes - protected but not user-specific
  app.get("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const data = insertCompanySettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateCompanySettings(data);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
