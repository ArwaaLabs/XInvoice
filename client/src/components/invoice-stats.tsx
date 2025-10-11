import { FileText, DollarSign, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
};

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold font-mono" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div
            className={`text-xs mt-2 ${
              trend.isPositive ? "text-chart-2" : "text-destructive"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type InvoiceStatsProps = {
  stats: {
    totalInvoices: number;
    totalRevenue: number;
    pending: number;
    paid: number;
    currency?: string;
  };
};

export function InvoiceStats({ stats }: InvoiceStatsProps) {
  const currency = stats.currency || "$";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Invoices"
        value={stats.totalInvoices.toString()}
        description="All time invoices"
        icon={<FileText className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Total Revenue"
        value={`${currency}${stats.totalRevenue.toLocaleString()}`}
        description="All time earnings"
        icon={<DollarSign className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatsCard
        title="Pending Payment"
        value={`${currency}${stats.pending.toLocaleString()}`}
        description="Awaiting payment"
        icon={<Clock className="h-4 w-4" />}
      />
      <StatsCard
        title="Paid Invoices"
        value={`${currency}${stats.paid.toLocaleString()}`}
        description="Completed this month"
        icon={<CheckCircle className="h-4 w-4" />}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
