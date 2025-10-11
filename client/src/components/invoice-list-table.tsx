import { format } from "date-fns";
import { MoreVertical, Eye, Download, Send, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

export type InvoiceListItem = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
};

type InvoiceListTableProps = {
  invoices: InvoiceListItem[];
  currency?: string;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onSend?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function InvoiceListTable({
  invoices,
  currency = "$",
  onView,
  onDownload,
  onSend,
  onDelete,
}: InvoiceListTableProps) {
  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    sent: "bg-chart-3 text-white",
    paid: "bg-chart-2 text-white",
    overdue: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover-elevate">
                <TableCell className="font-mono font-medium" data-testid={`text-invoice-${invoice.id}`}>
                  #{invoice.invoiceNumber}
                </TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(invoice.issueDate, "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(invoice.dueDate, "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[invoice.status]} data-testid={`badge-status-${invoice.id}`}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {currency}{invoice.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${invoice.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(invoice.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload?.(invoice.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      {invoice.status === "draft" && (
                        <DropdownMenuItem onClick={() => onSend?.(invoice.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send to Client
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete?.(invoice.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
