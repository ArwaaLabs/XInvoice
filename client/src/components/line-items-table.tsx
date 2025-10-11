import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: "percentage" | "fixed";
  taxRate: number;
};

type LineItemsTableProps = {
  items: LineItem[];
  currency?: string;
  onChange: (items: LineItem[]) => void;
};

export function LineItemsTable({ items, currency = "$", onChange }: LineItemsTableProps) {
  const addItem = () => {
    onChange([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: "percentage",
        taxRate: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateItemTotal = (item: LineItem) => {
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Description</TableHead>
              <TableHead className="w-[10%]">Qty</TableHead>
              <TableHead className="w-[12%]">Price</TableHead>
              <TableHead className="w-[12%]">Discount</TableHead>
              <TableHead className="w-[10%]">Tax %</TableHead>
              <TableHead className="w-[12%] text-right">Total</TableHead>
              <TableHead className="w-[4%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No items added yet
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      data-testid={`input-description-${item.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", parseInt(e.target.value) || 0)
                      }
                      data-testid={`input-quantity-${item.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                      data-testid={`input-unit-price-${item.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) =>
                          updateItem(item.id, "discount", parseFloat(e.target.value) || 0)
                        }
                        className="w-16"
                        data-testid={`input-discount-${item.id}`}
                      />
                      <Select
                        value={item.discountType}
                        onValueChange={(value) =>
                          updateItem(item.id, "discountType", value)
                        }
                      >
                        <SelectTrigger className="w-14" data-testid={`select-discount-type-${item.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="fixed">{currency}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.taxRate}
                      onChange={(e) =>
                        updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)
                      }
                      data-testid={`input-tax-${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {currency}{calculateItemTotal(item).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" onClick={addItem} data-testid="button-add-item">
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}
