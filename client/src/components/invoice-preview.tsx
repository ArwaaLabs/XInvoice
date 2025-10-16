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
    bankName?: string;
    accountNumber?: string;
    routingCode?: string;
    swiftCode?: string;
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
  primaryColor?: string;
};

type InvoicePreviewProps = {
  data: InvoiceData;
};

function calculateItemTotal(item: { quantity: number; unitPrice: number; discount: number; discountType: "percentage" | "fixed"; taxRate: number }) {
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
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
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

  const template = data.template || "modern";
  const primaryColor = data.primaryColor || "#3B82F6";

  if (template === "classic") {
    return (
      <Card className="p-8 max-w-4xl">
        <div className="space-y-8">
          <div className="border-b pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                {data.company.logo ? (
                  <img src={data.company.logo} alt="Company Logo" className="h-10" />
                ) : (
                  <h1 className="text-2xl font-serif font-bold">{data.company.name}</h1>
                )}
              </div>
              <div className="text-right space-y-1">
                <h2 className="text-3xl font-serif font-bold" data-testid="text-invoice-number">
                  INVOICE
                </h2>
                <p className="text-lg font-mono">#{data.invoiceNumber}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-serif font-bold mb-2">From:</h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{data.company.name}</p>
                  <p className="text-muted-foreground">{data.company.email}</p>
                  <p className="text-muted-foreground">{data.company.phone}</p>
                  <p className="text-muted-foreground">{data.company.address}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold mb-2">Bill To:</h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{data.client.name}</p>
                  <p className="text-muted-foreground">{data.client.email}</p>
                  <p className="text-muted-foreground">{data.client.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-serif font-bold">Invoice Date:</span>
                <span>{format(data.issueDate, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-serif font-bold">Due Date:</span>
                <span>{format(data.dueDate, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-serif font-bold">Status:</span>
                <Badge className={statusColors[data.status]} data-testid="badge-invoice-status">
                  {data.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-y">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-sm font-serif font-bold">
                    <th className="text-left p-3">Description</th>
                    <th className="text-right p-3">Qty</th>
                    <th className="text-right p-3">Rate</th>
                    <th className="text-right p-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right font-mono">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">
                        {data.currency}{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono font-medium">
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
                  <span>Subtotal</span>
                  <span className="font-mono">{data.currency}{subtotal.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span className="font-mono">-{data.currency}{totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                {totalTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span className="font-mono">{data.currency}{totalTax.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2"></div>
                <div className="flex justify-between text-lg font-serif font-bold">
                  <span>Total Due:</span>
                  <span className="font-mono" data-testid="text-total">
                    {data.currency}{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {data.notes && (
            <div className="space-y-2 border-t pt-6">
              <h3 className="text-sm font-serif font-bold">Notes:</h3>
              <p className="text-sm">{data.notes}</p>
            </div>
          )}

          {(data.company.bankName || data.company.accountNumber || data.company.routingCode || data.company.swiftCode) && (
            <div className="space-y-3 border-t pt-6">
              <h3 className="text-sm font-serif font-bold">Payment Information:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {data.company.bankName && (
                  <div className="flex justify-between">
                    <span className="font-serif">Bank Name:</span>
                    <span className="font-medium">{data.company.bankName}</span>
                  </div>
                )}
                {data.company.accountNumber && (
                  <div className="flex justify-between">
                    <span className="font-serif">Account Number:</span>
                    <span className="font-medium font-mono">{data.company.accountNumber}</span>
                  </div>
                )}
                {data.company.routingCode && (
                  <div className="flex justify-between">
                    <span className="font-serif">
                      {data.company.routingCode.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.company.routingCode) 
                        ? 'IFSC Code:'
                        : data.company.routingCode.length >= 8 && data.company.routingCode.length <= 11 && /^[A-Z]{4}/.test(data.company.routingCode)
                        ? 'IFSC Code:'
                        : 'Routing Code:'}
                    </span>
                    <span className="font-medium font-mono">{data.company.routingCode}</span>
                  </div>
                )}
                {data.company.swiftCode && (
                  <div className="flex justify-between">
                    <span className="font-serif">SWIFT/BIC Code:</span>
                    <span className="font-medium font-mono">{data.company.swiftCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (template === "minimal") {
    return (
      <Card className="p-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            {data.company.logo && (
              <img src={data.company.logo} alt="Company Logo" className="h-8" />
            )}
            <div className="text-right">
              <p className="text-xl font-light">Invoice</p>
              <p className="text-sm font-mono" data-testid="text-invoice-number">#{data.invoiceNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-medium">{data.company.name}</p>
              <p className="text-muted-foreground">{data.company.email}</p>
              <p className="text-muted-foreground">{data.company.phone}</p>
              <p className="text-muted-foreground">{data.company.address}</p>
            </div>
            <div>
              <p className="font-medium">{data.client.name}</p>
              <p className="text-muted-foreground">{data.client.email}</p>
              <p className="text-muted-foreground">{data.client.address}</p>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Issued: </span>
              <span>{format(data.issueDate, "MMM dd, yyyy")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Due: </span>
              <span>{format(data.dueDate, "MMM dd, yyyy")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status: </span>
              <Badge className={statusColors[data.status]} data-testid="badge-invoice-status">
                {data.status}
              </Badge>
            </div>
          </div>

          <div>
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-xs uppercase text-muted-foreground">
                  <th className="text-left pb-2">Description</th>
                  <th className="text-right pb-2">Qty</th>
                  <th className="text-right pb-2">Rate</th>
                  <th className="text-right pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right font-mono">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">
                      {data.currency}{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-mono">
                      {data.currency}{calculateItemTotal(item).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{data.currency}{subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-mono">-{data.currency}{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              {totalTax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-mono">{data.currency}{totalTax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total</span>
                <span className="font-medium font-mono" data-testid="text-total">
                  {data.currency}{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {data.notes && (
            <div className="text-sm border-t pt-4">
              <p className="text-muted-foreground mb-1">Notes:</p>
              <p>{data.notes}</p>
            </div>
          )}

          {(data.company.bankName || data.company.accountNumber || data.company.routingCode || data.company.swiftCode) && (
            <div className="text-sm border-t pt-4">
              <p className="text-muted-foreground mb-2">Payment Details:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {data.company.bankName && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Bank:</span>
                    <span>{data.company.bankName}</span>
                  </div>
                )}
                {data.company.accountNumber && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-mono">{data.company.accountNumber}</span>
                  </div>
                )}
                {data.company.routingCode && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">
                      {data.company.routingCode.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.company.routingCode) 
                        ? 'IFSC:'
                        : data.company.routingCode.length >= 8 && data.company.routingCode.length <= 11 && /^[A-Z]{4}/.test(data.company.routingCode)
                        ? 'IFSC:'
                        : 'Routing:'}
                    </span>
                    <span className="font-mono">{data.company.routingCode}</span>
                  </div>
                )}
                {data.company.swiftCode && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">SWIFT:</span>
                    <span className="font-mono">{data.company.swiftCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

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

        {(data.company.bankName || data.company.accountNumber || data.company.routingCode || data.company.swiftCode) && (
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-sm font-medium text-muted-foreground">Banking Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {data.company.bankName && (
                <div>
                  <span className="text-muted-foreground">Bank Name:</span>
                  <p className="font-medium">{data.company.bankName}</p>
                </div>
              )}
              {data.company.accountNumber && (
                <div>
                  <span className="text-muted-foreground">Account Number:</span>
                  <p className="font-medium font-mono">{data.company.accountNumber}</p>
                </div>
              )}
              {data.company.routingCode && (
                <div>
                  <span className="text-muted-foreground">
                    {data.company.routingCode.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.company.routingCode) 
                      ? 'IFSC Code:'
                      : data.company.routingCode.length >= 8 && data.company.routingCode.length <= 11 && /^[A-Z]{4}/.test(data.company.routingCode)
                      ? 'IFSC Code:'
                      : 'Routing/Sort Code:'}
                  </span>
                  <p className="font-medium font-mono">{data.company.routingCode}</p>
                </div>
              )}
              {data.company.swiftCode && (
                <div>
                  <span className="text-muted-foreground">SWIFT/BIC Code:</span>
                  <p className="font-medium font-mono">{data.company.swiftCode}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
