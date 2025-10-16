import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { InvoiceStats } from "@/components/invoice-stats";
import { InvoiceListTable, type InvoiceListItem } from "@/components/invoice-list-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { type CompanySettings } from "@shared/schema";

type Invoice = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  status: string;
  notes?: string | null;
  paymentAmount?: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: string;
    discount: string;
    discountType: string;
    taxRate: string;
  }>;
};

type Client = {
  id: string;
  name: string;
  email: string;
  address?: string | null;
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const calculateInvoiceTotal = (invoice: Invoice) => {
    return invoice.items.reduce((sum, item) => {
      const subtotal = item.quantity * parseFloat(item.unitPrice);
      let discountAmount = 0;
      if (item.discountType === "percentage") {
        discountAmount = (subtotal * parseFloat(item.discount)) / 100;
      } else {
        discountAmount = parseFloat(item.discount);
      }
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (afterDiscount * parseFloat(item.taxRate)) / 100;
      return sum + afterDiscount + taxAmount;
    }, 0);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || "Unknown Client";
  };

  const invoiceListItems: InvoiceListItem[] = invoices.slice(0, 5).map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    clientName: getClientName(invoice.clientId),
    issueDate: new Date(invoice.issueDate),
    dueDate: new Date(invoice.dueDate),
    amount: calculateInvoiceTotal(invoice),
    status: invoice.status as any,
    currency: invoice.currency,
  }));

  const groupByCurrency = (invoiceList: Invoice[]) => {
    return invoiceList.reduce((acc, inv) => {
      const currency = inv.currency || "USD";
      const total = calculateInvoiceTotal(inv);
      acc[currency] = (acc[currency] || 0) + total;
      return acc;
    }, {} as Record<string, number>);
  };

  const paidInvoices = invoices.filter(inv => inv.status === "paid");
  const pendingInvoices = invoices.filter(inv => inv.status === "sent" || inv.status === "overdue");
  const paidThisMonthInvoices = invoices.filter(inv => {
    const invoiceDate = new Date(inv.issueDate);
    const now = new Date();
    return inv.status === "paid" && 
      invoiceDate.getMonth() === now.getMonth() &&
      invoiceDate.getFullYear() === now.getFullYear();
  });

  const totalRevenueByCurrency = groupByCurrency(paidInvoices);
  const pendingAmountByCurrency = groupByCurrency(pendingInvoices);
  const paidThisMonthByCurrency = groupByCurrency(paidThisMonthInvoices);

  const primaryCurrency = Object.keys(totalRevenueByCurrency)[0] || "USD";
  const getCurrencySymbol = (code: string) => {
    const map: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥" };
    return map[code] || code;
  };

  const formatMultiCurrency = (amounts: Record<string, number>) => {
    return Object.entries(amounts)
      .map(([curr, amt]) => `${getCurrencySymbol(curr)}${Math.round(amt).toLocaleString()}`)
      .join(" + ") || `${getCurrencySymbol(primaryCurrency)}0`;
  };

  const stats = {
    totalInvoices: invoices.length,
    totalRevenue: Math.round(totalRevenueByCurrency[primaryCurrency] || 0),
    pending: Math.round(pendingAmountByCurrency[primaryCurrency] || 0),
    paid: Math.round(paidThisMonthByCurrency[primaryCurrency] || 0),
    currency: getCurrencySymbol(primaryCurrency),
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/invoices/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: t('invoices.deleteSuccess'),
        description: t('invoices.deleteSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('invoices.deleteError'),
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    const client = clients.find(c => c.id === invoice.clientId);
    const settings = await queryClient.fetchQuery<CompanySettings>({ queryKey: ["/api/settings"] });

    const pdfData = {
      invoiceNumber: invoice.invoiceNumber,
      issueDate: new Date(invoice.issueDate),
      dueDate: new Date(invoice.dueDate),
      status: invoice.status,
      template: settings?.template || "modern",
      primaryColor: settings?.primaryColor || "#3B82F6",
      paymentAmount: invoice.paymentAmount ? parseFloat(invoice.paymentAmount) : undefined,
      company: {
        name: settings?.companyName || "Your Company",
        email: settings?.email || "email@company.com",
        phone: settings?.phone || "+1 (555) 000-0000",
        address: settings?.address || "123 Business St, City, State 12345",
        logo: settings?.logo || undefined,
        bankName: settings?.bankName || undefined,
        accountNumber: settings?.accountNumber || undefined,
        routingCode: settings?.routingCode || undefined,
        swiftCode: settings?.swiftCode || undefined,
      },
      client: {
        name: client?.name || "Unknown Client",
        email: client?.email || "",
        address: client?.address || "",
      },
      items: invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        discount: parseFloat(item.discount),
        discountType: item.discountType as "percentage" | "fixed",
        taxRate: parseFloat(item.taxRate),
      })),
      currency: invoice.currency === "USD" ? "$" : invoice.currency,
      notes: invoice.notes || undefined,
    };

    generateInvoicePDF(pdfData);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground text-base">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Button 
          onClick={() => setLocation("/invoice/new")} 
          data-testid="button-create-invoice"
          size="lg"
          className="shadow-lg hover:shadow-xl"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t('dashboard.newInvoice')}
        </Button>
      </div>

      <InvoiceStats stats={stats} />

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-subtle">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{t('dashboard.recentInvoices')}</CardTitle>
              <CardDescription className="mt-1">{t('dashboard.recentInvoicesDesc')}</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/invoices")}
              className="shadow-sm"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {invoicesLoading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p>{t('dashboard.loadingInvoices')}</p>
              </div>
            </div>
          ) : (
            <InvoiceListTable
              invoices={invoiceListItems}
              onView={(id) => setLocation(`/invoice/${id}`)}
              onDownload={handleDownload}
              onSend={(id) => console.log("Send invoice", id)}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
