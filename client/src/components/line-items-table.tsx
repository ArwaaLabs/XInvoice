import { useState } from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  const [commonItems] = useState([
    { description: "Consulting Services", unitPrice: 150 },
    { description: "Design Work", unitPrice: 100 },
    { description: "Development Hours", unitPrice: 120 },
    { description: "Project Management", unitPrice: 100 },
    { description: "Training Session", unitPrice: 200 },
  ]);

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

  const addCommonItem = (preset: { description: string; unitPrice: number }) => {
    onChange([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: preset.description,
        quantity: 1,
        unitPrice: preset.unitPrice,
        discount: 0,
        discountType: "percentage",
        taxRate: 0,
      },
    ]);
  };

  const duplicateItem = (item: LineItem) => {
    onChange([
      ...items,
      {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
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

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string, field: keyof LineItem) => {
    // Auto-add new row when pressing Enter on the last row's last editable field
    if (e.key === "Enter" && field === "taxRate") {
      const itemIndex = items.findIndex(item => item.id === itemId);
      if (itemIndex === items.length - 1) {
        e.preventDefault();
        addItem();
      }
    }
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
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[45%]">Description</TableHead>
              <TableHead className="w-[8%] text-center">Qty</TableHead>
              <TableHead className="w-[13%] text-right">Unit Price</TableHead>
              <TableHead className="w-[10%] text-right">Disc.</TableHead>
              <TableHead className="w-[7%] text-right">Tax%</TableHead>
              <TableHead className="w-[12%] text-right">Amount</TableHead>
              <TableHead className="w-[5%] text-center"></TableHead>
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
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="py-2">
                    <Input
                      placeholder="Item description (e.g., Web design, Consulting...)"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="h-9 text-sm"
                      data-testid={`input-description-${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", parseInt(e.target.value) || 0)
                      }
                      onKeyDown={(e) => handleKeyDown(e, item.id, "quantity")}
                      className="h-9 text-sm text-center w-full"
                      placeholder="1"
                      data-testid={`input-quantity-${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                        {currency}
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                        }
                        onKeyDown={(e) => handleKeyDown(e, item.id, "unitPrice")}
                        className="h-9 text-sm text-right pr-3 pl-7 w-full"
                        placeholder="0.00"
                        data-testid={`input-unit-price-${item.id}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex gap-1 items-center w-full">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) =>
                          updateItem(item.id, "discount", parseFloat(e.target.value) || 0)
                        }
                        onKeyDown={(e) => handleKeyDown(e, item.id, "discount")}
                        className="h-9 text-sm text-right flex-1 min-w-0"
                        placeholder="0"
                        data-testid={`input-discount-${item.id}`}
                      />
                      <Select
                        value={item.discountType}
                        onValueChange={(value) =>
                          updateItem(item.id, "discountType", value)
                        }
                      >
                        <SelectTrigger className="h-9 w-11 text-xs p-0 flex-shrink-0" data-testid={`select-discount-type-${item.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="fixed">{currency}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.taxRate}
                      onChange={(e) =>
                        updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)
                      }
                      onKeyDown={(e) => handleKeyDown(e, item.id, "taxRate")}
                      className="h-9 text-sm text-right w-full"
                      placeholder="0"
                      data-testid={`input-tax-${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right font-mono text-sm font-semibold tabular-nums">
                    <div className="pr-2">
                      {currency}{calculateItemTotal(item).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex gap-0.5 justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateItem(item)}
                        title="Duplicate"
                        className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
                        data-testid={`button-duplicate-${item.id}`}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        title="Delete"
                        className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={addItem} 
          data-testid="button-add-item"
          className="h-9"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Item
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              data-testid="button-add-common"
              className="h-9"
            >
              Quick Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Common Items
            </div>
            <DropdownMenuSeparator />
            {commonItems.map((preset, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => addCommonItem(preset)}
                className="cursor-pointer text-sm"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="truncate">{preset.description}</span>
                  <span className="text-xs text-muted-foreground ml-3 font-mono">
                    {currency}{preset.unitPrice}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {items.length > 0 && (
          <div className="ml-auto text-xs text-muted-foreground flex items-center">
            💡 Tip: Press <kbd className="px-1.5 py-0.5 mx-1 bg-muted rounded text-xs">Tab</kbd> to navigate, 
            <kbd className="px-1.5 py-0.5 mx-1 bg-muted rounded text-xs">Enter</kbd> on last field to add new row
          </div>
        )}
      </div>
    </div>
  );
}
