import { useState } from "react";
import type { ParseResult } from "@/lib/parsers";
import type { ColumnMapping } from "@/lib/aggregators";

interface Props {
  parsed: ParseResult;
  onConfirm: (mapping: ColumnMapping) => void;
  onBack: () => void;
}

export function ColumnMapper({ parsed, onConfirm, onBack }: Props) {
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({});
  const [error, setError] = useState<string | null>(null);

  const fields: { key: keyof ColumnMapping; label: string; help: string }[] = [
    { key: "date", label: "Date Column", help: "Column containing order or transaction date" },
    { key: "revenue", label: "Revenue Column", help: "Column containing sale amount or revenue value" },
    { key: "product", label: "Product Column", help: "Column containing product name or category" },
    { key: "customerId", label: "Customer ID Column", help: "Column containing unique customer identifier" },
  ];

  const handleConfirm = () => {
    if (!mapping.date || !mapping.revenue || !mapping.product || !mapping.customerId) {
      setError("Please select all four columns before continuing.");
      return;
    }
    setError(null);
    onConfirm(mapping as ColumnMapping);
  };

  const previewRows = parsed.rows.slice(0, 5);
  const mappedCols = new Set(Object.values(mapping).filter(Boolean) as string[]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 animate-fade-in">
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <h1 className="text-2xl font-bold sm:text-3xl">Map Your Columns</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We detected <span className="font-semibold text-foreground">{parsed.columns.length}</span> columns and <span className="font-semibold text-foreground">{parsed.rows.length.toLocaleString()}</span> rows in your file. Tell us what each key column represents.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <span className="font-semibold">{parsed.filename}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{parsed.rows.length.toLocaleString()} rows</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{parsed.columns.length} columns</span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold">{f.label}</label>
              <select
                value={mapping[f.key] ?? ""}
                onChange={(e) => setMapping((m) => ({ ...m, [f.key]: e.target.value || undefined }))}
                className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">Select a column</option>
                {parsed.columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">{f.help}</p>
            </div>
          ))}
        </div>

        {previewRows.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold">Preview (first 5 rows)</h3>
            <div className="mt-2 overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {parsed.columns.map((c) => (
                      <th
                        key={c}
                        className={`px-3 py-2 text-left font-semibold ${mappedCols.has(c) ? "bg-primary/15 text-primary" : ""}`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {previewRows.map((r, i) => (
                    <tr key={i}>
                      {parsed.columns.map((c) => (
                        <td key={c} className={`px-3 py-2 text-foreground/80 ${mappedCols.has(c) ? "bg-primary/5" : ""}`}>
                          {formatCell(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onBack}
            className="rounded-md border border-input bg-background px-5 py-2 text-sm font-semibold transition-smooth hover:bg-accent"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-md gradient-hero px-5 py-2 text-sm font-semibold text-primary-foreground shadow-elevated transition-smooth hover:opacity-90"
          >
            Confirm and Analyse
          </button>
        </div>
      </div>
    </main>
  );
}

function formatCell(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object") return JSON.stringify(v);
  const s = String(v);
  return s.length > 40 ? s.slice(0, 39) + "…" : s;
}
