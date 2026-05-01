import { useMemo, useState } from "react";
import type { Row } from "@/lib/parsers";
import { formatNumber } from "@/lib/format";

interface Props {
  rows: Row[];
  columns: string[];
}

type SortDir = "asc" | "desc";

export function DataTable({ rows, columns }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => columns.some((c) => {
      const v = r[c];
      if (v == null) return false;
      return String(v).toLowerCase().includes(q);
    }));
  }, [rows, columns, search]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const an = typeof av === "number" ? av : parseFloat(String(av));
      const bn = typeof bv === "number" ? bv : parseFloat(String(bv));
      let cmp: number;
      if (!isNaN(an) && !isNaN(bn) && /^[\d.,\-$£€₹\s]+$/.test(String(av)) && /^[\d.,\-$£€₹\s]+$/.test(String(bv))) {
        cmp = an - bn;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const toggleSort = (c: string) => {
    if (sortCol === c) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(c); setSortDir("asc"); }
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let s = Math.max(1, safePage - 2);
    let e = Math.min(totalPages, s + maxButtons - 1);
    s = Math.max(1, e - maxButtons + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    return pages;
  }, [safePage, totalPages]);

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold">
          Raw Data <span className="text-sm font-normal text-muted-foreground">({formatNumber(sorted.length)} rows)</span>
        </h3>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search across all columns..."
          className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  onClick={() => toggleSort(c)}
                  className="cursor-pointer px-3 py-2 text-left font-semibold whitespace-nowrap select-none hover:bg-muted"
                >
                  {c}
                  {sortCol === c && <span className="ml-1 text-primary">{sortDir === "asc" ? "▲" : "▼"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {pageRows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-3 py-10 text-center text-muted-foreground">No rows match.</td></tr>
            ) : pageRows.map((r, i) => (
              <tr key={i} className="hover:bg-muted/30">
                {columns.map((c) => {
                  const raw = r[c];
                  const text = raw == null ? "" : typeof raw === "object" ? JSON.stringify(raw) : String(raw);
                  return (
                    <td key={c} className="px-3 py-2 max-w-xs truncate" title={text}>
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-muted-foreground">
          Showing {sorted.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, sorted.length)} of {formatNumber(sorted.length)} rows
        </div>
        <div className="flex items-center gap-1">
          <PageBtn onClick={() => setPage(1)} disabled={safePage === 1}>First</PageBtn>
          <PageBtn onClick={() => setPage(safePage - 1)} disabled={safePage === 1}>Prev</PageBtn>
          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`min-w-[2rem] rounded-md px-2 py-1 text-sm transition-smooth ${
                p === safePage ? "gradient-hero text-primary-foreground shadow-elevated" : "border hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
          <PageBtn onClick={() => setPage(safePage + 1)} disabled={safePage === totalPages}>Next</PageBtn>
          <PageBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>Last</PageBtn>
        </div>
      </div>
    </div>
  );
}

function PageBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border px-2 py-1 text-sm transition-smooth hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
