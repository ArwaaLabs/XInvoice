import { InvoiceStats } from "../invoice-stats";

export default function InvoiceStatsExample() {
  const stats = {
    totalInvoices: 148,
    totalRevenue: 89420,
    pending: 12340,
    paid: 5680,
    currency: "$",
  };

  return (
    <div className="p-6 space-y-6">
      <InvoiceStats stats={stats} />
    </div>
  );
}
