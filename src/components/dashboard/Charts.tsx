import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import type { TrendPoint, ProductRow, CustomerRow } from "@/lib/aggregators";
import { formatCurrency, formatNumber, truncate } from "@/lib/format";
import { EmptyState } from "./ChartCard";

const COLORS = ["oklch(0.55 0.22 274)", "oklch(0.65 0.20 300)", "oklch(0.62 0.18 220)", "oklch(0.70 0.18 180)", "oklch(0.72 0.18 60)"];

const tooltipStyle = {
  backgroundColor: "oklch(1 0 0)",
  border: "1px solid oklch(0.91 0.01 260)",
  borderRadius: "8px",
  fontSize: "12px",
  boxShadow: "0 4px 12px oklch(0 0 0 / 0.1)",
};

export function SalesTrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) return <EmptyState message="No sales trend data for this range." />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 260)" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="oklch(0.50 0.03 260)" />
        <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.50 0.03 260)" tickFormatter={(v) => formatCurrency(Number(v))} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="oklch(0.55 0.22 274)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "oklch(0.55 0.22 274)" }}
          activeDot={{ r: 5 }}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ProductRevenueChart({ data }: { data: ProductRow[] }) {
  if (data.length === 0) return <EmptyState message="No product data available." />;
  const chartData = data.map((d) => ({ ...d, productShort: truncate(d.product, 22) }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 28)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 260)" />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="oklch(0.50 0.03 260)" tickFormatter={(v) => formatCurrency(Number(v))} />
        <YAxis dataKey="productShort" type="category" tick={{ fontSize: 11 }} stroke="oklch(0.50 0.03 260)" width={130} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(_v, _n, item) => {
            const p = item?.payload as ProductRow;
            return [`${formatCurrency(p.revenue)} · ${formatNumber(p.orders)} orders`, p.product];
          }}
        />
        <Bar dataKey="revenue" fill="oklch(0.55 0.22 274)" radius={[0, 4, 4, 0]} animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CustomerTypesChart({ newCustomers, repeatCustomers, total }: { newCustomers: number; repeatCustomers: number; total: number }) {
  if (total === 0) return <EmptyState message="No customer data available." />;
  const data = [
    { name: "New", value: newCustomers },
    { name: "Repeat", value: repeatCustomers },
  ];
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationDuration={600}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v, n) => {
              const pct = total > 0 ? ((Number(v) / total) * 100).toFixed(1) : "0";
              return [`${formatNumber(Number(v))} (${pct}%)`, String(n)];
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" style={{ top: "-22px" }}>
        <div className="text-2xl font-bold">{formatNumber(total)}</div>
        <div className="text-xs text-muted-foreground">Customers</div>
      </div>
    </div>
  );
}

export function TopCustomersChart({ data }: { data: CustomerRow[] }) {
  if (data.length === 0) return <EmptyState message="No customer data available." />;
  const chartData = data.map((d) => ({ ...d, customerShort: truncate(d.customer, 22) }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 28)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 260)" />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="oklch(0.50 0.03 260)" tickFormatter={(v) => formatCurrency(Number(v))} />
        <YAxis dataKey="customerShort" type="category" tick={{ fontSize: 11 }} stroke="oklch(0.50 0.03 260)" width={130} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(_v, _n, item) => {
            const p = item?.payload as CustomerRow;
            return [`${formatCurrency(p.spend)} · ${formatNumber(p.orders)} orders`, p.customer];
          }}
        />
        <Bar dataKey="spend" fill="oklch(0.65 0.20 300)" radius={[0, 4, 4, 0]} animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}
