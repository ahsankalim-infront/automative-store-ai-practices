"use client";

import type { ReportResult } from "./types";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fileBase(report: ReportResult): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${report.meta.orderPrefix}-${slugify(report.meta.type)}-${date}`;
}

function formatCell(value: string | number, key: string): string | number {
  if (typeof value === "number" && /revenue|total|price|value|subtotal|shipping|discount|avgOrder/i.test(key)) {
    return value;
  }
  return value ?? "—";
}

export async function downloadReportExcel(report: ReportResult): Promise<void> {
  const XLSX = await import("xlsx");

  const headerRows: string[][] = [
    [report.meta.title],
    [report.meta.storeName],
    [`Period: ${report.meta.dateFrom} → ${report.meta.dateTo}`],
    [`Generated: ${new Date(report.meta.generatedAt).toLocaleString("en-PK")}`],
  ];
  if (report.meta.statusFilter) {
    headerRows.push([`Status: ${report.meta.statusFilter}`]);
  }
  headerRows.push([]);

  if (report.summary.length) {
    headerRows.push(["Summary"]);
    report.summary.forEach((s) => headerRows.push([s.label, s.value]));
    headerRows.push([]);
  }

  const tableHeader = report.columns.map((c) => c.label);
  const tableRows = report.rows.map((row) =>
    report.columns.map((col) => formatCell(row[col.key] ?? "—", col.key))
  );

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, tableHeader, ...tableRows]);

  ws["!cols"] = report.columns.map((col) => ({
    wch: Math.max(col.label.length, 14),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${fileBase(report)}.xlsx`);
}

export async function downloadReportPdf(report: ReportResult): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.setTextColor(213, 0, 0);
  doc.text(report.meta.title, 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(report.meta.storeName, 40, 58);
  doc.text(`Period: ${report.meta.dateFrom} → ${report.meta.dateTo}`, 40, 72);
  doc.text(`Generated: ${new Date(report.meta.generatedAt).toLocaleString("en-PK")}`, 40, 86);
  if (report.meta.statusFilter) {
    doc.text(`Status filter: ${report.meta.statusFilter}`, 40, 100);
  }

  let startY = report.meta.statusFilter ? 118 : 104;

  if (report.summary.length) {
    autoTable(doc, {
      startY,
      head: [["Metric", "Value"]],
      body: report.summary.map((s) => [s.label, s.value]),
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [213, 0, 0], textColor: 255 },
      margin: { left: 40, right: 40 },
      tableWidth: Math.min(280, pageWidth - 80),
    });
    startY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
  }

  autoTable(doc, {
    startY,
    head: [report.columns.map((c) => c.label)],
    body: report.rows.map((row) =>
      report.columns.map((col) => String(formatCell(row[col.key] ?? "—", col.key)))
    ),
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [17, 17, 17], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${data.pageNumber} · ${report.meta.rowCount} records · ${report.meta.storeName}`,
        40,
        doc.internal.pageSize.getHeight() - 20
      );
    },
  });

  doc.save(`${fileBase(report)}.pdf`);
}
