import { InvoiceListTable, type InvoiceListItem } from "../invoice-list-table";

export default function InvoiceListTableExample() {
  const invoices: InvoiceListItem[] = [
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
      dueDate: new Date("2025-11-10"),
      amount: 890.00,
      status: "draft",
    },
  ];

  return (
    <div className="p-6 max-w-6xl">
      <InvoiceListTable
        invoices={invoices}
        currency="$"
        onView={(id) => console.log("View invoice", id)}
        onDownload={(id) => console.log("Download invoice", id)}
        onSend={(id) => console.log("Send invoice", id)}
        onDelete={(id) => console.log("Delete invoice", id)}
      />
    </div>
  );
}
