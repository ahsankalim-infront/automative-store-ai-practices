import type { Order } from "@/types";
import { BRAND } from "@/lib/brand/config";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  LEGAL_META,
  ORDER_SUMMARY_TERMS,
  ORDER_SUMMARY_POLICIES,
  type PolicySection,
} from "@/lib/legal/order-policies";

const MARGIN = 40;
const PAGE_WIDTH = 595.28; // A4 pt
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_Y = 820;

function paymentLabel(method: string): string {
  const map: Record<string, string> = {
    cod: "Cash on Delivery",
    card: "Credit / Debit Card",
    bank_transfer: "Bank Transfer",
    wallet: "Digital Wallet",
  };
  return map[method] || method.replace(/_/g, " ").toUpperCase();
}

function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function addPageFooter(doc: import("jspdf").jsPDF, pageNum: number) {
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(
    `${BRAND.name} · ${BRAND.address.full} · ${BRAND.email}`,
    MARGIN,
    FOOTER_Y
  );
  doc.text(`Page ${pageNum}`, PAGE_WIDTH - MARGIN, FOOTER_Y, { align: "right" });
}

function ensureSpace(
  doc: import("jspdf").jsPDF,
  y: number,
  needed: number,
  pageNum: { current: number }
): number {
  if (y + needed > FOOTER_Y - 20) {
    addPageFooter(doc, pageNum.current);
    doc.addPage();
    pageNum.current += 1;
    return MARGIN + 10;
  }
  return y;
}

function writeSectionBlock(
  doc: import("jspdf").jsPDF,
  section: PolicySection,
  startY: number,
  pageNum: { current: number }
): number {
  let y = ensureSpace(doc, startY, 24, pageNum);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  doc.text(section.title, MARGIN, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 55, 55);

  for (const paragraph of section.paragraphs) {
    const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH);
    y = ensureSpace(doc, y, lines.length * 12 + 4, pageNum);
    doc.text(lines, MARGIN, y);
    y += lines.length * 12 + 4;
  }

  if (section.bullets?.length) {
    for (const bullet of section.bullets) {
      const lines = doc.splitTextToSize(`• ${bullet}`, CONTENT_WIDTH - 8);
      y = ensureSpace(doc, y, lines.length * 11 + 2, pageNum);
      doc.text(lines, MARGIN + 4, y);
      y += lines.length * 11 + 2;
    }
  }

  return y + 8;
}

export async function buildOrderSummaryPdf(order: Order): Promise<ArrayBuffer> {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageNum = { current: 1 };

  // Header band
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, PAGE_WIDTH, 72, "F");
  doc.setTextColor(213, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(BRAND.name.toUpperCase(), MARGIN, 28);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Order Summary", MARGIN, 52);
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generated ${new Date().toLocaleString("en-PK")}`, PAGE_WIDTH - MARGIN, 28, { align: "right" });
  doc.text(`Terms effective ${LEGAL_META.effectiveDate}`, PAGE_WIDTH - MARGIN, 42, { align: "right" });

  let y = 92;

  // Order meta
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Order ${order.orderNumber}`, MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Placed: ${formatDate(order.createdAt)}`, MARGIN, y + 14);
  doc.text(`Status: ${statusLabel(order.status)}`, MARGIN + 180, y + 14);
  doc.text(`Payment: ${paymentLabel(order.paymentMethod)}`, MARGIN + 320, y + 14);
  y += 36;

  // Customer & shipping
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  doc.text("Customer & Delivery", MARGIN, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  const addr = order.shippingAddress;
  const addressLines = doc.splitTextToSize(
    [
      `Name: ${addr.fullName}`,
      `Phone: ${addr.phone}`,
      `Address: ${addr.address}, ${addr.city}, ${addr.state}${addr.postalCode ? ` ${addr.postalCode}` : ""}, ${addr.country}`,
      order.notes ? `Order notes: ${order.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    CONTENT_WIDTH
  );
  doc.text(addressLines, MARGIN, y);
  y += addressLines.length * 11 + 12;

  // Items table
  autoTable(doc, {
    startY: y,
    head: [["Product", "SKU", "Qty", "Unit Price", "Line Total"]],
    body: order.items.map((item) => [
      `${item.productName}${item.variant ? ` (${item.variant})` : ""}`,
      item.sku || "—",
      String(item.quantity),
      formatPrice(item.price),
      formatPrice(item.price * item.quantity),
    ]),
    styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
    headStyles: { fillColor: [213, 0, 0], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    margin: { left: MARGIN, right: MARGIN },
    theme: "grid",
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  // Totals
  const totals: [string, string][] = [
    ["Subtotal", formatPrice(order.subtotal)],
    ["Shipping", formatPrice(order.shippingCost)],
  ];
  if (order.discount > 0) totals.push(["Discount", `-${formatPrice(order.discount)}`]);
  if (order.tax > 0) totals.push(["Tax", formatPrice(order.tax)]);
  totals.push(["Grand Total", formatPrice(order.total)]);

  autoTable(doc, {
    startY: y,
    body: totals,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: "bold" },
      1: { halign: "right" },
    },
    margin: { left: PAGE_WIDTH - MARGIN - 200, right: MARGIN },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  // Acknowledgement
  y = ensureSpace(doc, y, 40, pageNum);
  doc.setFillColor(255, 245, 245);
  doc.roundedRect(MARGIN, y - 8, CONTENT_WIDTH, 36, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(213, 0, 0);
  doc.text("Customer Acknowledgement", MARGIN + 10, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  const ack = doc.splitTextToSize(
    "By completing this purchase you agree to the Terms & Conditions and store policies printed on the following pages of this document.",
    CONTENT_WIDTH - 20
  );
  doc.text(ack, MARGIN + 10, y + 18);
  y += 52;

  addPageFooter(doc, pageNum.current);

  // Terms page
  doc.addPage();
  pageNum.current += 1;
  y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(213, 0, 0);
  doc.text("Terms & Conditions", MARGIN, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Last updated: ${LEGAL_META.lastUpdated}`, MARGIN, y + 10);
  y += 24;

  for (const section of ORDER_SUMMARY_TERMS) {
    y = writeSectionBlock(doc, section, y, pageNum);
  }

  // Policies page
  y = ensureSpace(doc, y, 40, pageNum);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(213, 0, 0);
  doc.text("Store Policies", MARGIN, y);
  y += 22;

  for (const section of ORDER_SUMMARY_POLICIES) {
    y = writeSectionBlock(doc, section, y, pageNum);
  }

  // Contact footer block
  y = ensureSpace(doc, y, 60, pageNum);
  doc.setDrawColor(213, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 17);
  doc.text("Contact Shahzad Poshish House", MARGIN, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`Phone: ${BRAND.primaryPhone} · Email: ${BRAND.email}`, MARGIN, y);
  y += 10;
  doc.text(BRAND.address.full, MARGIN, y);
  y += 10;
  doc.text(BRAND.businessHours, MARGIN, y);

  addPageFooter(doc, pageNum.current);

  return doc.output("arraybuffer");
}

export function orderSummaryPdfFilename(order: Order): string {
  return `${order.orderNumber}-order-summary.pdf`;
}

export async function buildOrderSummaryPdfBuffer(order: Order): Promise<Buffer> {
  const arrayBuffer = await buildOrderSummaryPdf(order);
  return Buffer.from(arrayBuffer);
}
