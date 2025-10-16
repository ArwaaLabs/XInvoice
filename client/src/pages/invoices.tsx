import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search, Filter, Plus } from "lucide-react";
import { InvoiceListTable, type InvoiceListItem } from "@/components/invoice-list-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  status: string;
  currency: string;
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

export default function Invoices() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
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

  const invoiceListItems: InvoiceListItem[] = invoices.map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    clientName: getClientName(invoice.clientId),
    issueDate: new Date(invoice.issueDate),
    dueDate: new Date(invoice.dueDate),
    amount: calculateInvoiceTotal(invoice),
    status: invoice.status as any,
    currency: invoice.currency,
  }));

  const filteredInvoices = invoiceListItems.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleSend = async (id: string) => {
    try {
      await apiRequest("POST", `/api/invoices/${id}/send`);
      await queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: t('invoices.sendSuccess'),
        description: t('invoices.sendSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('invoices.sendError'),
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t('invoices.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('invoices.subtitle')}
          </p>
        </div>
        <Button onClick={() => setLocation("/invoice/new")} data-testid="button-new-invoice">
          <Plus className="mr-2 h-4 w-4" />
          {t('invoices.createInvoice')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search') + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-filter-status">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('invoices.allStatus')}</SelectItem>
            <SelectItem value="draft">{t('invoices.statuses.draft')}</SelectItem>
            <SelectItem value="sent">{t('invoices.statuses.sent')}</SelectItem>
            <SelectItem value="paid">{t('invoices.statuses.paid')}</SelectItem>
            <SelectItem value="overdue">{t('invoices.statuses.overdue')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          {t('common.loading')}
        </div>
      ) : (
        <InvoiceListTable
          invoices={filteredInvoices}
          onView={(id) => setLocation(`/invoice/${id}`)}
          onDownload={handleDownload}
          onSend={handleSend}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
