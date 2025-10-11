import { format } from "date-fns";
import { Calendar, Mail, Phone, MapPin, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type InvoiceData = {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue";
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    discountType: "percentage" | "fixed";
    taxRate: number;
  }>;
  currency: string;
  notes?: string;
  template?: "modern" | "classic" | "minimal";
};

type InvoicePreviewProps = {
  data: InvoiceData;
};

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const calculateItemTotal = (item: typeof data.items[0]) => {
    const subtotal = item.quantity * item.unitPrice;
    let discountAmount = 0;
    if (item.discountType === "percentage") {
      discountAmount = (subtotal * item.discount) / 100;
    } else {
      discountAmount = item.discount;
    }
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * item.taxRate) / 100;
    return afterDiscount + taxAmount;
  };

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalDiscount = data.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return (
      sum +
      (item.discountType === "percentage"
        ? (itemSubtotal * item.discount) / 100
        : item.discount)
    );
  }, 0);
  const totalTax = data.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount =
      item.discountType === "percentage"
        ? (itemSubtotal * item.discount) / 100
        : item.discount;
    return sum + ((itemSubtotal - discountAmount) * item.taxRate) / 100;
  }, 0);
  const total = subtotal - totalDiscount + totalTax;

  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    sent: "bg-chart-3 text-white",
    paid: "bg-chart-2 text-white",
    overdue: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="p-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {data.company.logo ? (
              <img src={data.company.logo} alt="Company Logo" className="h-12" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-semibold">{data.company.name}</h1>
              </div>
            )}
          </div>
          <div className="text-right space-y-1">
            <Badge className={statusColors[data.status]} data-testid="badge-invoice-status">
              {data.status.toUpperCase()}
            </Badge>
            <h2 className="text-3xl font-semibold font-mono" data-testid="text-invoice-number">
              #{data.invoiceNumber}
            </h2>
            <p className="text-sm text-muted-foreground">INVOICE</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">From</h3>
              <div className="space-y-1">
                <p className="font-medium">{data.company.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{data.company.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{data.company.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5" />
                  <span>{data.company.address}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Bill To</h3>
              <div className="space-y-1">
                <p className="font-medium">{data.client.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{data.client.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5" />
                  <span>{data.client.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Issue Date</span>
              <span className="font-medium flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {format(data.issueDate, "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Due Date</span>
              <span className="font-medium flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {format(data.dueDate, "MMM dd, yyyy")}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Due</span>
              <span className="text-2xl font-semibold font-mono" data-testid="text-total">
                {data.currency}{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="text-sm">
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-right p-4 font-medium">Qty</th>
                  <th className="text-right p-4 font-medium">Rate</th>
                  <th className="text-right p-4 font-medium">Discount</th>
                  <th className="text-right p-4 font-medium">Tax</th>
                  <th className="text-right p-4 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4">{item.description}</td>
                    <td className="p-4 text-right font-mono">{item.quantity}</td>
                    <td className="p-4 text-right font-mono">
                      {data.currency}{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-muted-foreground">
                      {item.discount > 0
                        ? item.discountType === "percentage"
                          ? `${item.discount}%`
                          : `${data.currency}${item.discount}`
                        : "-"}
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-muted-foreground">
                      {item.taxRate > 0 ? `${item.taxRate}%` : "-"}
                    </td>
                    <td className="p-4 text-right font-mono font-medium">
                      {data.currency}{calculateItemTotal(item).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{data.currency}{subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Discount</span>
                  <span className="font-mono text-destructive">
                    -{data.currency}{totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              {totalTax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tax</span>
                  <span className="font-mono">{data.currency}{totalTax.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-semibold font-mono">
                  {data.currency}{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {data.notes && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
            <p className="text-sm">{data.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
