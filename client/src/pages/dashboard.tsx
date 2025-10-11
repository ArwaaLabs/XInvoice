import { useState } from "react";
import { InvoiceStats } from "@/components/invoice-stats";
import { InvoiceListTable, type InvoiceListItem } from "@/components/invoice-list-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard() {
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
  ]);

  const stats = {
    totalInvoices: 148,
    totalRevenue: 89420,
    pending: 12340,
    paid: 5680,
    currency: "$",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your invoicing activity
          </p>
        </div>
        <Button data-testid="button-create-invoice">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <InvoiceStats stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your latest billing activity</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <InvoiceListTable
            invoices={invoices}
            currency="$"
            onView={(id) => console.log("View invoice", id)}
            onDownload={(id) => console.log("Download invoice", id)}
            onSend={(id) => console.log("Send invoice", id)}
            onDelete={(id) => console.log("Delete invoice", id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
