import { formatCurrency, formatNumber, formatPct } from "@/lib/format";

interface KpiCardProps {
  label: string;
  value: string;
  pctChange: number | null;
  icon: React.ReactNode;
}

export function KpiCard({ label, value, pctChange, icon }: KpiCardProps) {
  const positive = (pctChange ?? 0) >= 0;
  return (
    <div className="group rounded-2xl border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-hero text-primary-foreground shadow-glow">
          {icon}
        </div>
        {pctChange !== null && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          }`}>
            <span aria-hidden>{positive ? "▲" : "▼"}</span>
            {formatPct(pctChange)}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

interface KpisRowProps {
  current: { totalRevenue: number; totalOrders: number; uniqueCustomers: number; avgOrderValue: number };
  baseline: { totalRevenue: number; totalOrders: number; uniqueCustomers: number; avgOrderValue: number };
  isFiltered: boolean;
}

export function KpisRow({ current, baseline, isFiltered }: KpisRowProps) {
  const pct = (cur: number, base: number) => {
    if (!isFiltered || base === 0) return null;
    return ((cur - base) / base) * 100;
  };

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(current.totalRevenue),
      pct: pct(current.totalRevenue, baseline.totalRevenue),
      icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-9h6a2 2 0 010 4H9a2 2 0 010 4h6" /></svg>),
    },
    {
      label: "Total Orders",
      value: formatNumber(current.totalOrders),
      pct: pct(current.totalOrders, baseline.totalOrders),
      icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17m-9 4a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>),
    },
    {
      label: "Unique Customers",
      value: formatNumber(current.uniqueCustomers),
      pct: pct(current.uniqueCustomers, baseline.uniqueCustomers),
      icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(current.avgOrderValue, true),
      pct: pct(current.avgOrderValue, baseline.avgOrderValue),
      icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l3-3 4 4 5-6" /></svg>),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <KpiCard key={c.label} label={c.label} value={c.value} pctChange={c.pct} icon={c.icon} />
      ))}
    </div>
  );
}
