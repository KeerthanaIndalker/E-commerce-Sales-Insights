const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const currencyFmt2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numberFmt = new Intl.NumberFormat("en-US");

export function formatCurrency(n: number, decimals = false): string {
  if (!isFinite(n)) return "$0";
  return decimals ? currencyFmt2.format(n) : currencyFmt.format(n);
}

export function formatNumber(n: number): string {
  return numberFmt.format(n);
}

export function formatPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function truncate(s: string, max = 40): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}
