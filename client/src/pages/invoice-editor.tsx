import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Save, Download, Send, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { LineItemsTable, type LineItem } from "@/components/line-items-table";
import { InvoicePreview } from "@/components/invoice-preview";
import { ClientSelector, type Client } from "@/components/client-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
];

type CompanySettings = {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  address: string | null;
  logo: string | null;
  invoicePrefix: string | null;
  nextInvoiceNumber: number | null;
};

export default function InvoiceEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: settings } = useQuery<CompanySettings>({
    queryKey: ["/api/settings"],
  });

  const [selectedClient, setSelectedClient] = useState<string>();
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState<"draft" | "sent" | "paid" | "overdue">("draft");
  const [notes, setNotes] = useState("Payment is due within 30 days. Thank you for your business!");
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: "percentage",
      taxRate: 0,
    },
  ]);

  const handleAddClient = async (newClient: Omit<Client, "id">) => {
    try {
      const response = await apiRequest("POST", "/api/clients", newClient);
      const client = await response.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setSelectedClient(client.id);
      toast({
        title: "Client added",
        description: "New client has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (saveStatus: "draft" | "sent" = "draft") => {
    if (!selectedClient) {
      toast({
        title: "Client required",
        description: "Please select a client for this invoice.",
        variant: "destructive",
      });
      return;
    }

    const invoiceNumber = `${settings?.invoicePrefix || "INV"}-${settings?.nextInvoiceNumber || 1001}`;

    try {
      const invoiceData = {
        invoiceNumber,
        clientId: selectedClient,
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        currency,
        status: saveStatus,
        notes,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          discount: item.discount.toString(),
          discountType: item.discountType,
          taxRate: item.taxRate.toString(),
        })),
      };

      await apiRequest("POST", "/api/invoices", invoiceData);

      if (settings) {
        await apiRequest("POST", "/api/settings", {
          ...settings,
          nextInvoiceNumber: (settings.nextInvoiceNumber || 1001) + 1,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/settings"] });

      toast({
        title: saveStatus === "draft" ? "Draft saved" : "Invoice sent",
        description: `Invoice ${invoiceNumber} has been ${saveStatus === "draft" ? "saved as draft" : "sent to client"}.`,
      });

      setLocation("/invoices");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save invoice.",
        variant: "destructive",
      });
    }
  };

  const selectedClientData = clients.find((c) => c.id === selectedClient);
  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol || "$";

  const previewData = {
    invoiceNumber: `${settings?.invoicePrefix || "INV"}-${settings?.nextInvoiceNumber || 1001}`,
    issueDate,
    dueDate,
    status,
    company: {
      name: settings?.companyName || "Your Company",
      email: settings?.email || "email@company.com",
      phone: settings?.phone || "+1 (555) 000-0000",
      address: settings?.address || "123 Business St, City, State 12345",
      logo: settings?.logo || undefined,
    },
    client: selectedClientData
      ? {
          name: selectedClientData.name,
          email: selectedClientData.email,
          address: selectedClientData.address || "",
        }
      : {
          name: "Select a client",
          email: "",
          address: "",
        },
    items: items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      discountType: item.discountType as "percentage" | "fixed",
      taxRate: item.taxRate,
    })),
    currency: currencySymbol,
    notes,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/invoices")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold">Create Invoice</h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details to generate a new invoice
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave("draft")} data-testid="button-save-draft">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave("sent")} data-testid="button-send-invoice">
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                {clientsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading clients...</div>
                ) : (
                  <ClientSelector
                    clients={clients}
                    value={selectedClient}
                    onSelect={setSelectedClient}
                    onAddClient={handleAddClient}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !issueDate && "text-muted-foreground"
                        )}
                        data-testid="button-issue-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {issueDate ? format(issueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={issueDate}
                        onSelect={(date) => date && setIssueDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                        data-testid="button-due-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => date && setDueDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" data-testid="select-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <LineItemsTable
                items={items}
                currency={currencySymbol}
                onChange={setItems}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any notes or payment terms..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                data-testid="input-notes"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="sticky top-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Preview</h2>
                <Select defaultValue="modern">
                  <SelectTrigger className="w-40" data-testid="select-template">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <InvoicePreview data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
