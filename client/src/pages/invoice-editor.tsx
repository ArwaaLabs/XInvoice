import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Save, Download, Send, ArrowLeft, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { LineItemsTable, type LineItem } from "@/components/line-items-table";
import { InvoicePreview } from "@/components/invoice-preview";
import { ClientSelector, type Client } from "@/components/client-selector";
import { CompanySelector, type CompanySettings } from "@/components/company-selector";
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
import { useLocation, useParams } from "wouter";
import { currencies } from "@shared/currencies";

type InvoiceFromAPI = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  companyId?: string | null;
  issueDate: string;
  dueDate: string;
  status: string;
  currency: string;
  notes?: string | null;
  sentDate?: string | null;
  paidDate?: string | null;
  paymentAmount?: string | null;
  paymentMethod?: string | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: string;
    discount: string;
    discountType: string;
    taxRate: string;
  }>;
};

export default function InvoiceEditor() {
  const { id: invoiceId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = !!invoiceId && invoiceId !== 'new';

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: companies = [], isLoading: companiesLoading } = useQuery<CompanySettings[]>({
    queryKey: ["/api/companies"],
  });

  const { data: existingInvoice, isLoading: invoiceLoading } = useQuery<InvoiceFromAPI>({
    queryKey: ["/api/invoices", invoiceId],
    queryFn: async () => {
      if (!isEditMode) return null;
      const response = await apiRequest("GET", `/api/invoices/${invoiceId}`);
      return response.json();
    },
    enabled: isEditMode,
  });

  const [selectedClient, setSelectedClient] = useState<string>();
  const [selectedCompany, setSelectedCompany] = useState<string>();
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  );
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState<"draft" | "sent" | "paid" | "overdue">("draft");
  const [notes, setNotes] = useState("Payment is due within 15 days. Thank you for your business!");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
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

  // Auto-select primary company on load
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany && !isEditMode) {
      const primaryCompany = companies.find(c => c.isPrimary === "true");
      setSelectedCompany(primaryCompany?.id || companies[0].id);
    }
  }, [companies, selectedCompany, isEditMode]);

  // Load existing invoice data when in edit mode
  useEffect(() => {
    if (existingInvoice && isEditMode) {
      setSelectedClient(existingInvoice.clientId);
      setSelectedCompany(existingInvoice.companyId || undefined);
      setIssueDate(new Date(existingInvoice.issueDate));
      setDueDate(new Date(existingInvoice.dueDate));
      setCurrency(existingInvoice.currency);
      setStatus(existingInvoice.status as "draft" | "sent" | "paid" | "overdue");
      setNotes(existingInvoice.notes || "Payment is due within 15 days. Thank you for your business!");
      setPaymentAmount(existingInvoice.paymentAmount ? parseFloat(existingInvoice.paymentAmount) : 0);
      setPaymentMethod(existingInvoice.paymentMethod || "");
      
      const loadedItems: LineItem[] = existingInvoice.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        discount: parseFloat(item.discount),
        discountType: item.discountType as "percentage" | "fixed",
        taxRate: parseFloat(item.taxRate),
      }));
      
      setItems(loadedItems.length > 0 ? loadedItems : [{
        id: "1",
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: "percentage",
        taxRate: 0,
      }]);
    }
  }, [existingInvoice, isEditMode]);

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

  const handleAddCompany = async (newCompany: Omit<CompanySettings, "id" | "userId" | "isPrimary" | "isActive" | "createdAt">) => {
    try {
      const response = await apiRequest("POST", "/api/companies", newCompany);
      const company = await response.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setSelectedCompany(company.id);
      toast({
        title: "Company added",
        description: "New company has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add company.",
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

    if (!selectedCompany) {
      toast({
        title: "Company required",
        description: "Please select a company for this invoice.",
        variant: "destructive",
      });
      return;
    }

    const company = companies.find(c => c.id === selectedCompany);
    if (!company) {
      toast({
        title: "Error",
        description: "Selected company not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Determine the final status:
      // If "Send via Email" is clicked, override to "sent"
      // Otherwise, use the manually selected status from the dropdown
      const finalStatus = saveStatus === "sent" ? "sent" : status;

      // Calculate invoice total for payment tracking
      const invoiceTotal = items.reduce((sum, item) => {
        const subtotal = item.quantity * item.unitPrice;
        const discountAmount = item.discountType === "percentage"
          ? (subtotal * item.discount) / 100
          : item.discount;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * item.taxRate) / 100;
        return sum + afterDiscount + taxAmount;
      }, 0);

      // Auto-set payment amount when status is paid and paymentAmount is not set
      const finalPaymentAmount = finalStatus === "paid" && paymentAmount === 0 ? invoiceTotal : paymentAmount;

      const invoiceData: any = {
        clientId: selectedClient,
        companyId: selectedCompany,
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        currency,
        status: finalStatus,
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

      // Auto-update sentDate when status changes to sent
      if (finalStatus === "sent" && (!existingInvoice || existingInvoice.status !== "sent")) {
        invoiceData.sentDate = new Date().toISOString();
      }

      // Auto-update paidDate and paymentAmount when status changes to paid
      if (finalStatus === "paid") {
        if (!existingInvoice || existingInvoice.status !== "paid") {
          invoiceData.paidDate = new Date().toISOString();
        }
        invoiceData.paymentAmount = finalPaymentAmount.toString();
        if (paymentMethod) {
          invoiceData.paymentMethod = paymentMethod;
        }
      }

      let invoice;
      let invoiceNumber;

      if (isEditMode) {
        // Update existing invoice
        const response = await apiRequest("PATCH", `/api/invoices/${invoiceId}`, invoiceData);
        invoice = await response.json();
        invoiceNumber = invoice.invoiceNumber;
      } else {
        // Create new invoice
        invoiceNumber = `${company.invoicePrefix || "INV"}-${company.nextInvoiceNumber || 1001}`;
        const response = await apiRequest("POST", "/api/invoices", {
          ...invoiceData,
          invoiceNumber,
        });
        invoice = await response.json();

        // Increment invoice number only for new invoices
        await apiRequest("PATCH", `/api/companies/${selectedCompany}`, {
          nextInvoiceNumber: (company.nextInvoiceNumber || 1001) + 1,
        });
      }

      // If status is 'sent', send the email
      if (saveStatus === "sent") {
        await apiRequest("POST", `/api/invoices/${invoice.id}/send`);
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      if (!isEditMode) {
        await queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      }

      toast({
        title: saveStatus === "sent" ? "Invoice sent" : (isEditMode ? "Invoice updated" : "Invoice saved"),
        description: saveStatus === "sent" 
          ? `Invoice ${invoiceNumber} has been emailed to the client successfully.`
          : `Invoice ${invoiceNumber} has been ${isEditMode ? 'updated' : 'saved'} as ${finalStatus}.`,
      });

      setLocation("/invoices");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save invoice.",
        variant: "destructive",
      });
    }
  };

  const selectedClientData = clients.find((c) => c.id === selectedClient);
  const selectedCompanyData = companies.find((c) => c.id === selectedCompany);
  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol || "$";

  const previewData = {
    invoiceNumber: isEditMode && existingInvoice 
      ? existingInvoice.invoiceNumber 
      : `${selectedCompanyData?.invoicePrefix || "INV"}-${selectedCompanyData?.nextInvoiceNumber || 1001}`,
    issueDate,
    dueDate,
    status,
    template: selectedCompanyData?.template as "modern" | "classic" | "minimal" | undefined,
    primaryColor: selectedCompanyData?.primaryColor || undefined,
    company: {
      name: selectedCompanyData?.companyName || "Your Company",
      email: selectedCompanyData?.email || "email@company.com",
      phone: selectedCompanyData?.phone || "+1 (555) 000-0000",
      address: selectedCompanyData?.address || "123 Business St, City, State 12345",
      logo: selectedCompanyData?.logo || undefined,
      bankName: selectedCompanyData?.bankName || undefined,
      accountNumber: selectedCompanyData?.accountNumber || undefined,
      routingCode: selectedCompanyData?.routingCode || undefined,
      swiftCode: selectedCompanyData?.swiftCode || undefined,
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
            <h1 className="text-3xl font-semibold">{isEditMode ? 'Edit Invoice' : 'Create Invoice'}</h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? 'Update invoice details' : 'Fill in the details to generate a new invoice'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSave("draft")} 
            data-testid="button-save-draft"
            disabled={invoiceLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Save Changes' : 'Save Draft'}
          </Button>
          <Button 
            onClick={() => handleSave("sent")} 
            data-testid="button-send-invoice"
            disabled={invoiceLoading}
          >
            <Send className="mr-2 h-4 w-4" />
            Send via Email
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
                <Label htmlFor="company">Company</Label>
                {(companiesLoading || invoiceLoading) ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <CompanySelector
                    companies={companies}
                    value={selectedCompany}
                    onSelect={setSelectedCompany}
                    onAddCompany={handleAddCompany}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                {(clientsLoading || invoiceLoading) ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3 border-b space-y-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => {
                              const today = new Date();
                              setIssueDate(today);
                              // Auto-update due date to 15 days from new issue date
                              setDueDate(new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000));
                            }}
                          >
                            Today
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => {
                              const yesterday = new Date();
                              yesterday.setDate(yesterday.getDate() - 1);
                              setIssueDate(yesterday);
                              // Auto-update due date to 15 days from new issue date
                              setDueDate(new Date(yesterday.getTime() + 15 * 24 * 60 * 60 * 1000));
                            }}
                          >
                            Yesterday
                          </Button>
                        </div>
                      </div>
                      <Calendar
                        mode="single"
                        selected={issueDate}
                        onSelect={(date) => {
                          if (date) {
                            setIssueDate(date);
                            // Auto-update due date to maintain the gap if due date is before new issue date
                            if (dueDate < date) {
                              setDueDate(new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000));
                            }
                          }
                        }}
                        initialFocus
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3 border-b space-y-2">
                        <p className="text-xs text-muted-foreground mb-2">Quick select from issue date:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setDueDate(new Date(issueDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
                          >
                            +7 days
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setDueDate(new Date(issueDate.getTime() + 15 * 24 * 60 * 60 * 1000))}
                          >
                            +15 days
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setDueDate(new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000))}
                          >
                            +30 days
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setDueDate(new Date(issueDate.getTime() + 60 * 24 * 60 * 60 * 1000))}
                          >
                            +60 days
                          </Button>
                        </div>
                      </div>
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => date && setDueDate(date)}
                        disabled={(date) => date < issueDate}
                        initialFocus
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
                  <SelectContent className="max-h-[300px]">
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} - {c.name} ({c.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Invoice Status</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger id="status" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Change status manually or use "Send via Email" to mark as sent
                </p>
              </div>

              {status === "paid" && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-sm font-medium">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">Payment Amount</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Auto-filled on save"
                        value={paymentAmount || ""}
                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                        data-testid="input-payment-amount"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank to use invoice total
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger id="paymentMethod" data-testid="select-payment-method">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
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

          {isEditMode && existingInvoice && (existingInvoice.sentDate || existingInvoice.paidDate) && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingInvoice.sentDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3/10">
                        <Send className="h-4 w-4 text-chart-3" />
                      </div>
                      <div>
                        <p className="font-medium">Invoice Sent</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(existingInvoice.sentDate), "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                  )}
                  {existingInvoice.paidDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/10">
                        <CheckCircle className="h-4 w-4 text-chart-2" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Received</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(existingInvoice.paidDate), "PPP 'at' p")}
                          {existingInvoice.paymentAmount && (
                            <> • {currencies.find(c => c.code === currency)?.symbol || "$"}{parseFloat(existingInvoice.paymentAmount).toFixed(2)}</>
                          )}
                          {existingInvoice.paymentMethod && (
                            <> • via {existingInvoice.paymentMethod.replace('_', ' ')}</>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
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
