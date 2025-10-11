import { useState } from "react";
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

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [invoices] = useState<InvoiceListItem[]>([
    {
      id: "1",
      invoiceNumber: "INV-1001",
      clientName: "Tech Corp",
      issueDate: new Date("2025-10-01"),
      dueDate: new Date("2025-10-31"),
      amount: 3456.78,
      status: "paid",
    },
    {
      id: "2",
      invoiceNumber: "INV-1002",
      clientName: "Design Agency",
      issueDate: new Date("2025-10-05"),
      dueDate: new Date("2025-11-05"),
      amount: 1234.56,
      status: "sent",
    },
    {
      id: "3",
      invoiceNumber: "INV-1003",
      clientName: "Startup Inc",
      issueDate: new Date("2025-10-10"),
      dueDate: new Date("2025-09-15"),
      amount: 890.00,
      status: "overdue",
    },
    {
      id: "4",
      invoiceNumber: "INV-1004",
      clientName: "Marketing Co",
      issueDate: new Date("2025-10-08"),
      dueDate: new Date("2025-11-08"),
      amount: 2100.00,
      status: "draft",
    },
    {
      id: "5",
      invoiceNumber: "INV-1005",
      clientName: "Consulting Group",
      issueDate: new Date("2025-10-12"),
      dueDate: new Date("2025-11-12"),
      amount: 5670.00,
      status: "sent",
    },
  ]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your invoices in one place
          </p>
        </div>
        <Button data-testid="button-new-invoice">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <InvoiceListTable
        invoices={filteredInvoices}
        currency="$"
        onView={(id) => console.log("View invoice", id)}
        onDownload={(id) => console.log("Download invoice", id)}
        onSend={(id) => console.log("Send invoice", id)}
        onDelete={(id) => console.log("Delete invoice", id)}
      />
    </div>
  );
}
