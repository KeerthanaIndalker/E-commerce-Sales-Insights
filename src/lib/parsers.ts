import Papa from "papaparse";

export type Row = Record<string, unknown>;

export interface ParseResult {
  rows: Row[];
  columns: string[];
  filename: string;
}

export async function parseFile(file: File, maxRows?: number): Promise<ParseResult> {
  const name = file.name.toLowerCase();
  const text = await file.text();
  const cleaned = text.replace(/^\uFEFF/, "");

  if (name.endsWith(".csv")) {
    return parseCsv(cleaned, file.name, maxRows);
  }
  if (name.endsWith(".json")) {
    return parseJson(cleaned, file.name, maxRows);
  }
  throw new Error("Unsupported file type. Please upload a .csv or .json file.");
}

function parseCsv(text: string, filename: string, maxRows?: number): ParseResult {
  const result = Papa.parse<Row>(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  if (!result.data || result.data.length === 0) {
    throw new Error("File is empty or contains no rows.");
  }
  const rows = (maxRows && maxRows > 0 ? result.data.slice(0, maxRows) : result.data) as Row[];
  const columns = result.meta.fields?.map((f) => f.trim()) ?? Object.keys(rows[0] ?? {});
  return { rows, columns, filename };
}

function parseJson(text: string, filename: string, maxRows?: number): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Malformed JSON. Hint: ensure the file is valid JSON syntax.");
  }
  let arr: Row[] | null = null;
  if (Array.isArray(data)) arr = data as Row[];
  else if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    arr = (data as { data: Row[] }).data;
  }
  if (!arr || arr.length === 0) {
    throw new Error("JSON must be an array of objects, or an object with a 'data' array.");
  }
  if (typeof arr[0] !== "object" || arr[0] === null) {
    throw new Error("JSON entries must be objects.");
  }
  const rows = (maxRows && maxRows > 0 ? arr.slice(0, maxRows) : arr) as Row[];
  const columnSet = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => columnSet.add(k)));
  return { rows, columns: Array.from(columnSet), filename };
}

export function parseRevenue(value: unknown): number {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/[$£€₹,\s]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export function parseDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const s = String(value).trim();

  // ISO YYYY-MM-DD or full ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  // DD/MM/YYYY or MM/DD/YYYY
  const slashMatch = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (slashMatch) {
    let [, a, b, y] = slashMatch;
    let year = parseInt(y, 10);
    if (year < 100) year += 2000;
    const ai = parseInt(a, 10);
    const bi = parseInt(b, 10);
    // Heuristic: if first > 12 it's DD/MM, else assume MM/DD (US default).
    let month: number, day: number;
    if (ai > 12) { day = ai; month = bi; }
    else if (bi > 12) { month = ai; day = bi; }
    else { month = ai; day = bi; }
    const d = new Date(Date.UTC(year, month - 1, day));
    return isNaN(d.getTime()) ? null : d;
  }
  const fallback = new Date(s);
  return isNaN(fallback.getTime()) ? null : fallback;
}
