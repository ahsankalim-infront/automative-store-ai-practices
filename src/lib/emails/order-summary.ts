import type { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import type { BrandConfig } from "@/lib/brand/types";
import { DEFAULT_BRAND } from "@/lib/brand/config";

function itemRows(order: Order): string {
  return order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.productName}${item.variant ? ` (${item.variant})` : ""}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");
}

export function buildOrderSummaryEmailHtml(
  order: Order,
  options: { forAdmin?: boolean; customerEmail?: string; brand?: BrandConfig } = {}
): string {
  const { forAdmin = false, customerEmail, brand = DEFAULT_BRAND } = options;
  const title = forAdmin ? "New Order Received" : "Your Order Confirmation";
  const intro = forAdmin
    ? `A new order has been placed on ${brand.name}.`
    : `Thank you for shopping with ${brand.name}! Here is your order summary.`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr>
          <td style="background:#111;padding:24px 28px;">
            <p style="margin:0;color:#D50000;font-size:12px;font-weight:bold;letter-spacing:1px;">${brand.name.toUpperCase()}</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">${title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.6;">${intro}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:12px;color:#888;">Order number</p>
                  <p style="margin:0;font-size:18px;font-weight:bold;color:#111;">${order.orderNumber}</p>
                </td>
                <td style="padding:16px 20px;text-align:right;">
                  <p style="margin:0 0 4px;font-size:12px;color:#888;">Total</p>
                  <p style="margin:0;font-size:18px;font-weight:bold;color:#D50000;">${formatPrice(order.total)}</p>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;color:#666;"><strong>Customer:</strong> ${order.shippingAddress.fullName}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#666;"><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            ${customerEmail ? `<p style="margin:0 0 8px;font-size:13px;color:#666;"><strong>Email:</strong> ${customerEmail}</p>` : ""}
            <p style="margin:0 0 20px;font-size:13px;color:#666;"><strong>Delivery:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
            <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#111;">Order items</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;font-size:13px;">
              <thead>
                <tr style="background:#f9f9f9;">
                  <th style="padding:10px 12px;text-align:left;color:#666;">Product</th>
                  <th style="padding:10px 12px;text-align:center;color:#666;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;color:#666;">Amount</th>
                </tr>
              </thead>
              <tbody>${itemRows(order)}</tbody>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:13px;">
              <tr><td style="padding:4px 0;color:#666;">Subtotal</td><td style="text-align:right;">${formatPrice(order.subtotal)}</td></tr>
              <tr><td style="padding:4px 0;color:#666;">Shipping</td><td style="text-align:right;">${formatPrice(order.shippingCost)}</td></tr>
              ${order.discount > 0 ? `<tr><td style="padding:4px 0;color:#666;">Discount</td><td style="text-align:right;color:#16a34a;">-${formatPrice(order.discount)}</td></tr>` : ""}
              <tr><td style="padding:8px 0;font-weight:bold;color:#111;">Total</td><td style="text-align:right;font-weight:bold;color:#D50000;">${formatPrice(order.total)}</td></tr>
            </table>
            <p style="margin:20px 0 0;font-size:12px;color:#888;">Payment: ${order.paymentMethod.toUpperCase()} · Status: ${order.status.replace(/_/g, " ")}</p>
            ${forAdmin ? `<p style="margin:16px 0 0;"><a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/admin/orders" style="display:inline-block;background:#D50000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">View in Admin</a></p>` : `<p style="margin:16px 0 0;font-size:13px;color:#666;">Your order summary PDF (with terms & policies) is attached to this email.</p><p style="margin:8px 0 0;font-size:13px;color:#666;">Questions? Call ${brand.primaryPhone} or email ${brand.email}</p>`}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;background:#fafafa;border-top:1px solid #eee;">
            <p style="margin:0;font-size:11px;color:#999;text-align:center;">${brand.name} · ${brand.address.full}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildOrderSummaryEmailText(
  order: Order,
  options: { forAdmin?: boolean; brand?: BrandConfig } = {}
): string {
  const { forAdmin = false, brand = DEFAULT_BRAND } = options;
  const lines = [
    forAdmin ? `New order — ${brand.name}` : `Order confirmation — ${brand.name}`,
    "",
    `Order: ${order.orderNumber}`,
    `Customer: ${order.shippingAddress.fullName}`,
    `Phone: ${order.shippingAddress.phone}`,
    `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}`,
    "",
    "Items:",
    ...order.items.map(
      (i) => `- ${i.productName} x${i.quantity} = ${formatPrice(i.price * i.quantity)}`
    ),
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping: ${formatPrice(order.shippingCost)}`,
    order.discount > 0 ? `Discount: -${formatPrice(order.discount)}` : "",
    `Total: ${formatPrice(order.total)}`,
    "",
    `Payment: ${order.paymentMethod} · Status: ${order.status}`,
  ].filter(Boolean);
  return lines.join("\n");
}
