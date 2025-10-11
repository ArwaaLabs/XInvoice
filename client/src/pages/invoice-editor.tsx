import { useState } from "react";
import { CalendarIcon, Save, Download, Send } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
];

export default function InvoiceEditor() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Tech Corp",
      email: "contact@techcorp.com",
      address: "456 Business Blvd, New York, NY 10001",
    },
    {
      id: "2",
      name: "Design Agency",
      email: "hello@designagency.com",
      address: "789 Creative Lane, Los Angeles, CA 90001",
    },
  ]);

  const [selectedClient, setSelectedClient] = useState<string>();
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("Payment is due within 30 days. Thank you for your business!");
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "Web Development Services",
      quantity: 40,
      unitPrice: 85,
      discount: 10,
      discountType: "percentage",
      taxRate: 8,
    },
  ]);

  const handleAddClient = (newClient: Omit<Client, "id">) => {
    const client: Client = {
      ...newClient,
      id: Math.random().toString(36).substr(2, 9),
    };
    setClients([...clients, client]);
    setSelectedClient(client.id);
  };

  const selectedClientData = clients.find((c) => c.id === selectedClient);
  const currencySymbol =
    currencies.find((c) => c.code === currency)?.symbol || "$";

  const previewData = {
    invoiceNumber: "INV-1001",
    issueDate,
    dueDate,
    status: "draft" as const,
    company: {
      name: "Design Studio Inc.",
      email: "hello@designstudio.com",
      phone: "+1 (555) 123-4567",
      address: "123 Creative Ave, San Francisco, CA 94102",
    },
    client: selectedClientData || {
      name: "Select a client",
      email: "",
      address: "",
    },
    items,
    currency: currencySymbol,
    notes,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Create Invoice</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to generate a new invoice
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-save-draft">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" data-testid="button-download-pdf">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button data-testid="button-send-invoice">
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
                <ClientSelector
                  clients={clients}
                  value={selectedClient}
                  onSelect={setSelectedClient}
                  onAddClient={handleAddClient}
                />
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
