import { useState } from "react";
import { LineItemsTable, type LineItem } from "../line-items-table";

export default function LineItemsTableExample() {
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "Web Development Services",
      quantity: 40,
      unitPrice: 85,
      discount: 10,
      discountType: "percentage",
      taxRate: 8,
    },
    {
      id: "2",
      description: "UI/UX Design Consultation",
      quantity: 8,
      unitPrice: 120,
      discount: 0,
      discountType: "percentage",
      taxRate: 8,
    },
  ]);

  return (
    <div className="p-6 max-w-6xl">
      <LineItemsTable items={items} currency="$" onChange={setItems} />
    </div>
  );
}
