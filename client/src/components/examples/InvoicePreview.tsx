import { InvoicePreview } from "../invoice-preview";

export default function InvoicePreviewExample() {
  const data = {
    invoiceNumber: "INV-1001",
    issueDate: new Date("2025-10-01"),
    dueDate: new Date("2025-10-31"),
    status: "sent" as const,
    company: {
      name: "Design Studio Inc.",
      email: "hello@designstudio.com",
      phone: "+1 (555) 123-4567",
      address: "123 Creative Ave, San Francisco, CA 94102",
    },
    client: {
      name: "Tech Corp",
      email: "accounts@techcorp.com",
      address: "456 Business Blvd, New York, NY 10001",
    },
    items: [
      {
        description: "Web Development Services",
        quantity: 40,
        unitPrice: 85,
        discount: 10,
        discountType: "percentage" as const,
        taxRate: 8,
      },
      {
        description: "UI/UX Design Consultation",
        quantity: 8,
        unitPrice: 120,
        discount: 0,
        discountType: "percentage" as const,
        taxRate: 8,
      },
    ],
    currency: "$",
    notes: "Payment is due within 30 days. Thank you for your business!",
  };

  return (
    <div className="p-6 bg-background">
      <InvoicePreview data={data} />
    </div>
  );
}
