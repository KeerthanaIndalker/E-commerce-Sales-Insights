import { useMemo, useState } from "react";
import type { ParseResult, Row } from "@/lib/parsers";
import {
  type ColumnMapping,
  computeKpis, computeSalesTrend, computeProductRevenue,
  computeCustomerSpend, computeCustomerTypes, filterByDateRange,
} from "@/lib/aggregators";
import { KpisRow } from "./KpiCards";
import { ChartCard } from "./ChartCard";
import { SalesTrendChart, ProductRevenueChart, CustomerTypesChart, TopCustomersChart } from "./Charts";
import { DataTable } from "./DataTable";
import { exportCsv, exportPdf } from "@/lib/exports";

interface Props {
  parsed: ParseResult;
  mapping: ColumnMapping;
  onUploadNew: () => void;
}

export function Dashboard({ parsed, mapping, onUploadNew }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStart, setAppliedStart] = useState<Date | null>(null);
  const [appliedEnd, setAppliedEnd] = useState<Date | null>(null);

  const filteredRows: Row[] = useMemo(
    () => filterByDateRange(parsed.rows, mapping, appliedStart, appliedEnd),
    [parsed.rows, mapping, appliedStart, appliedEnd]
  );

  const isFiltered = appliedStart !== null || appliedEnd !== null;
  const baselineKpis = useMemo(() => computeKpis(parsed.rows, mapping), [parsed.rows, mapping]);
  const kpis = useMemo(() => computeKpis(filteredRows, mapping), [filteredRows, mapping]);
  const trend = useMemo(() => computeSalesTrend(filteredRows, mapping), [filteredRows, mapping]);
  const products = useMemo(() => computeProductRevenue(filteredRows, mapping, 10), [filteredRows, mapping]);
  const customers = useMemo(() => computeCustomerSpend(filteredRows, mapping, 10), [filteredRows, mapping]);
  const custTypes = useMemo(() => computeCustomerTypes(filteredRows, mapping), [filteredRows, mapping]);

  const apply = () => {
    setAppliedStart(startDate ? new Date(startDate) : null);
    setAppliedEnd(endDate ? new Date(endDate) : null);
  };
  const reset = () => {
    setStartDate(""); setEndDate("");
    setAppliedStart(null); setAppliedEnd(null);
  };

  const baseName = parsed.filename.replace(/\.[^.]+$/, "");

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {parsed.filename}
          </span>
          <span className="text-xs text-muted-foreground">
            {parsed.rows.length.toLocaleString()} rows · {parsed.columns.length} columns
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <span className="text-muted-foreground">to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <button onClick={apply} className="rounded-md gradient-hero px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-smooth hover:opacity-90">
            Apply
          </button>
          <button onClick={reset} className="text-sm text-primary hover:underline">Reset Filter</button>
          <button onClick={onUploadNew} className="rounded-md border border-input px-3 py-1.5 text-sm font-semibold transition-smooth hover:bg-accent">
            Upload New File
          </button>
        </div>
      </div>

      <KpisRow current={kpis} baseline={baselineKpis} isFiltered={isFiltered} />

      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">1. Sales Trends</h2>
          <p className="text-sm text-muted-foreground">How revenue moves over time across your dataset.</p>
        </div>
        <ChartCard title="Sales Trend Over Time"><SalesTrendChart data={trend} /></ChartCard>
      </section>

      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">2. Customer Behavior</h2>
          <p className="text-sm text-muted-foreground">Who's buying — new vs. returning, and your highest spenders.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="New vs Repeat Customers">
            <CustomerTypesChart newCustomers={custTypes.newCustomers} repeatCustomers={custTypes.repeatCustomers} total={custTypes.total} />
          </ChartCard>
          <ChartCard title="Top 10 Customers by Spend"><TopCustomersChart data={customers} /></ChartCard>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">3. Top Products</h2>
          <p className="text-sm text-muted-foreground">Your best-selling items by total revenue.</p>
        </div>
        <ChartCard title="Revenue by Product (Top 10)"><ProductRevenueChart data={products} /></ChartCard>
      </section>

      <div className="mt-5">
        <DataTable rows={filteredRows} columns={parsed.columns} />
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-semibold">Download Reports</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="text-base font-semibold">Export as CSV</h3>
            <p className="mt-1 text-sm text-muted-foreground">Download currently filtered data as a CSV file.</p>
            <button
              onClick={() => exportCsv(filteredRows, parsed.columns, `${baseName}-filtered`)}
              disabled={filteredRows.length === 0}
              className="mt-4 rounded-md gradient-hero px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elevated transition-smooth hover:opacity-90 disabled:opacity-50"
            >
              Download CSV
            </button>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="text-base font-semibold">Export as PDF</h3>
            <p className="mt-1 text-sm text-muted-foreground">Download a formatted summary report with KPIs, top products, and top customers.</p>
            <button
              onClick={() => exportPdf({ filename: `${baseName}-report`, kpis, products, customers })}
              disabled={filteredRows.length === 0}
              className="mt-4 rounded-md gradient-hero px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elevated transition-smooth hover:opacity-90 disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
