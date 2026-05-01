import type { Row } from "./parsers";
import { parseDate, parseRevenue } from "./parsers";

export interface ColumnMapping {
  date: string;
  revenue: string;
  product: string;
  customerId: string;
}

export interface Kpis {
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  avgOrderValue: number;
}

export function computeKpis(rows: Row[], mapping: ColumnMapping): Kpis {
  let totalRevenue = 0;
  const customers = new Set<string>();
  for (const r of rows) {
    totalRevenue += parseRevenue(r[mapping.revenue]);
    const c = r[mapping.customerId];
    if (c != null && c !== "") customers.add(String(c));
  }
  const totalOrders = rows.length;
  return {
    totalRevenue,
    totalOrders,
    uniqueCustomers: customers.size,
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
}

export interface TrendPoint {
  label: string;
  revenue: number;
  ts: number;
}

export function computeSalesTrend(rows: Row[], mapping: ColumnMapping): TrendPoint[] {
  const dated: { date: Date; revenue: number }[] = [];
  for (const r of rows) {
    const d = parseDate(r[mapping.date]);
    if (!d) continue;
    dated.push({ date: d, revenue: parseRevenue(r[mapping.revenue]) });
  }
  if (dated.length === 0) return [];
  dated.sort((a, b) => a.date.getTime() - b.date.getTime());
  const minT = dated[0].date.getTime();
  const maxT = dated[dated.length - 1].date.getTime();
  const spanDays = (maxT - minT) / (1000 * 60 * 60 * 24);
  const groupByMonth = spanDays > 90;

  const map = new Map<string, { ts: number; revenue: number }>();
  for (const { date, revenue } of dated) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const day = date.getUTCDate();
    const key = groupByMonth ? `${y}-${String(m + 1).padStart(2, "0")}` : `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const ts = groupByMonth ? Date.UTC(y, m, 1) : Date.UTC(y, m, day);
    const cur = map.get(key);
    if (cur) cur.revenue += revenue;
    else map.set(key, { ts, revenue });
  }
  const fmt = new Intl.DateTimeFormat("en-US", groupByMonth ? { month: "short", year: "numeric" } : { month: "short", day: "numeric" });
  return Array.from(map.entries())
    .map(([, v]) => ({ label: fmt.format(new Date(v.ts)), revenue: v.revenue, ts: v.ts }))
    .sort((a, b) => a.ts - b.ts);
}

export interface ProductRow {
  product: string;
  revenue: number;
  orders: number;
}

export function computeProductRevenue(rows: Row[], mapping: ColumnMapping, topN = 10): ProductRow[] {
  const map = new Map<string, ProductRow>();
  for (const r of rows) {
    const name = r[mapping.product];
    const key = name == null || name === "" ? "(unknown)" : String(name);
    const revenue = parseRevenue(r[mapping.revenue]);
    const cur = map.get(key);
    if (cur) { cur.revenue += revenue; cur.orders += 1; }
    else map.set(key, { product: key, revenue, orders: 1 });
  }
  const all = Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  if (all.length <= topN) return all;
  const top = all.slice(0, topN);
  const rest = all.slice(topN);
  const others: ProductRow = {
    product: "Others",
    revenue: rest.reduce((s, p) => s + p.revenue, 0),
    orders: rest.reduce((s, p) => s + p.orders, 0),
  };
  return [...top, others];
}

export interface CustomerRow {
  customer: string;
  spend: number;
  orders: number;
}

export function computeCustomerSpend(rows: Row[], mapping: ColumnMapping, topN = 10): CustomerRow[] {
  const map = new Map<string, CustomerRow>();
  for (const r of rows) {
    const id = r[mapping.customerId];
    if (id == null || id === "") continue;
    const key = String(id);
    const revenue = parseRevenue(r[mapping.revenue]);
    const cur = map.get(key);
    if (cur) { cur.spend += revenue; cur.orders += 1; }
    else map.set(key, { customer: key, spend: revenue, orders: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.spend - a.spend).slice(0, topN);
}

export function computeCustomerTypes(rows: Row[], mapping: ColumnMapping): { newCustomers: number; repeatCustomers: number; total: number } {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const id = r[mapping.customerId];
    if (id == null || id === "") continue;
    const key = String(id);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let newC = 0, rep = 0;
  counts.forEach((n) => { if (n > 1) rep++; else newC++; });
  return { newCustomers: newC, repeatCustomers: rep, total: counts.size };
}

export function filterByDateRange(rows: Row[], mapping: ColumnMapping, start: Date | null, end: Date | null): Row[] {
  if (!start && !end) return rows;
  const startT = start ? start.getTime() : -Infinity;
  const endT = end ? end.getTime() + (24 * 60 * 60 * 1000 - 1) : Infinity;
  return rows.filter((r) => {
    const d = parseDate(r[mapping.date]);
    if (!d) return false;
    const t = d.getTime();
    return t >= startT && t <= endT;
  });
}
