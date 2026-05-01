import type { ParseResult, Row } from "./parsers";
import { parseDate, parseRevenue } from "./parsers";
import type { ColumnMapping } from "./aggregators";

interface Score {
  column: string;
  score: number;
}

const SAMPLE = 20;

function sampleValues(rows: Row[], col: string): unknown[] {
  const out: unknown[] = [];
  for (let i = 0; i < rows.length && out.length < SAMPLE; i++) {
    const v = rows[i][col];
    if (v != null && v !== "") out.push(v);
  }
  return out;
}

function ratio(values: unknown[], pred: (v: unknown) => boolean): number {
  if (values.length === 0) return 0;
  let n = 0;
  for (const v of values) if (pred(v)) n++;
  return n / values.length;
}

function bestBy(scores: Score[]): string | null {
  const valid = scores.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return valid.length > 0 ? valid[0].column : null;
}

function detectDate(columns: string[], rows: Row[]): string | null {
  const re = /(^|[_\s-])(date|time|timestamp|created|ordered|order[_\s-]?date|purchased)([_\s-]|$)/i;
  const scores: Score[] = columns.map((c) => {
    const headerHit = re.test(c) ? 0.5 : 0;
    const r = ratio(sampleValues(rows, c), (v) => parseDate(v) !== null);
    return { column: c, score: r >= 0.6 ? r + headerHit : headerHit > 0 && r >= 0.3 ? r + headerHit : 0 };
  });
  return bestBy(scores);
}

function detectRevenue(columns: string[], rows: Row[], excluded: Set<string>): string | null {
  const strong = /(revenue|sales|grand[_\s-]?total|subtotal|amount|total)/i;
  const weak = /(price|value|paid)/i;
  const scores: Score[] = columns.map((c) => {
    if (excluded.has(c)) return { column: c, score: 0 };
    const vals = sampleValues(rows, c);
    const numericRatio = ratio(vals, (v) => {
      if (typeof v === "number") return isFinite(v);
      if (typeof v !== "string") return false;
      return /[\d]/.test(v) && !isNaN(parseRevenue(v)) && parseRevenue(v) !== 0;
    });
    if (numericRatio < 0.6) return { column: c, score: 0 };
    let header = 0;
    if (strong.test(c)) header = 0.6;
    else if (weak.test(c)) header = 0.3;
    return { column: c, score: numericRatio + header };
  });
  return bestBy(scores);
}

function detectProduct(columns: string[], excluded: Set<string>): string | null {
  const re = /(product|item|sku|title)/i;
  const nameRe = /^name$/i;
  const customerName = /customer[_\s-]?name/i;
  for (const c of columns) {
    if (excluded.has(c)) continue;
    if (re.test(c) && !customerName.test(c)) return c;
  }
  for (const c of columns) {
    if (excluded.has(c)) continue;
    if (nameRe.test(c)) return c;
  }
  return null;
}

function detectCustomer(columns: string[], excluded: Set<string>): string | null {
  const idRe = /(customer[_\s-]?id|client[_\s-]?id|buyer[_\s-]?id|user[_\s-]?id)/i;
  const emailRe = /email/i;
  const generic = /(customer|client|buyer)/i;
  for (const c of columns) if (!excluded.has(c) && idRe.test(c)) return c;
  for (const c of columns) if (!excluded.has(c) && emailRe.test(c)) return c;
  for (const c of columns) if (!excluded.has(c) && generic.test(c)) return c;
  return null;
}

export interface AutoDetectResult {
  mapping: ColumnMapping | null;
  missing: string[];
}

export function autoDetect(parsed: ParseResult): AutoDetectResult {
  const { columns, rows } = parsed;
  const date = detectDate(columns, rows);
  const excluded = new Set<string>();
  if (date) excluded.add(date);
  const revenue = detectRevenue(columns, rows, excluded);
  if (revenue) excluded.add(revenue);
  const product = detectProduct(columns, excluded) ?? "";
  if (product) excluded.add(product);
  const customerId = detectCustomer(columns, excluded) ?? "";

  const missing: string[] = [];
  if (!date) missing.push("date");
  if (!revenue) missing.push("revenue");

  if (!date || !revenue) return { mapping: null, missing };
  return {
    mapping: { date, revenue, product, customerId },
    missing,
  };
}
