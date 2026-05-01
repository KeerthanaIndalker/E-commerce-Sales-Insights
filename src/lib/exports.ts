import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Row } from "@/lib/parsers";
import type { Kpis, ProductRow, CustomerRow } from "@/lib/aggregators";
import { formatCurrency, formatNumber } from "@/lib/format";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function exportCsv(rows: Row[], columns: string[], baseName: string) {
  const csv = Papa.unparse({ fields: columns, data: rows.map((r) => columns.map((c) => r[c] ?? "")) });
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${baseName}.csv`);
}

interface PdfOpts {
  filename: string;
  kpis: Kpis;
  products: ProductRow[];
  customers: CustomerRow[];
}

export function exportPdf({ filename, kpis, products, customers }: PdfOpts) {
  const doc = new jsPDF();
  const generated = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(new Date());

  doc.setFontSize(20);
  doc.setTextColor(31, 41, 55);
  doc.text("Sales Analytics Report", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${generated}`, 14, 28);

  autoTable(doc, {
    startY: 36,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", formatCurrency(kpis.totalRevenue)],
      ["Total Orders", formatNumber(kpis.totalOrders)],
      ["Unique Customers", formatNumber(kpis.uniqueCustomers)],
      ["Avg Order Value", formatCurrency(kpis.avgOrderValue, true)],
    ],
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  });

  let y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 80;
  doc.setFontSize(13);
  doc.setTextColor(31, 41, 55);
  doc.text("Top Products by Revenue", 14, y + 12);
  autoTable(doc, {
    startY: y + 16,
    head: [["Product", "Revenue", "Orders"]],
    body: products.slice(0, 10).map((p) => [p.product, formatCurrency(p.revenue), formatNumber(p.orders)]),
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  });

  y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 60;
  doc.setFontSize(13);
  doc.text("Top Customers by Spend", 14, y + 12);
  autoTable(doc, {
    startY: y + 16,
    head: [["Customer ID", "Total Spend", "Orders"]],
    body: customers.slice(0, 10).map((c) => [c.customer, formatCurrency(c.spend), formatNumber(c.orders)]),
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 8);
  }

  doc.save(`${filename}.pdf`);
}
