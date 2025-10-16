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
    <Card className="transition-all duration-200 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-mono tracking-tight" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        <p className="text-sm text-muted-foreground mt-2 font-medium">{description}</p>
        {trend && (
          <div
            className={`text-sm mt-3 font-semibold flex items-center gap-1 ${
              trend.isPositive ? "text-chart-2" : "text-destructive"
            }`}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{trend.isPositive ? "+" : ""}{trend.value}% from last month</span>
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-in-from-bottom">
      <StatsCard
        title="Total Invoices"
        value={stats.totalInvoices.toString()}
        description="All time invoices"
        icon={<FileText className="h-5 w-5" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Total Revenue"
        value={`${currency}${stats.totalRevenue.toLocaleString()}`}
        description="All time earnings"
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatsCard
        title="Pending Payment"
        value={`${currency}${stats.pending.toLocaleString()}`}
        description="Awaiting payment"
        icon={<Clock className="h-5 w-5" />}
      />
      <StatsCard
        title="Paid Invoices"
        value={`${currency}${stats.paid.toLocaleString()}`}
        description="Completed this month"
        icon={<CheckCircle className="h-5 w-5" />}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
