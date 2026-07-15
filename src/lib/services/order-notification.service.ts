import type { Order } from "@/types";
import { BRAND } from "@/lib/brand/config";
import { formatPrice } from "@/lib/utils";
import {
  getUsers,
  createNotification,
  updateNotification,
} from "@/lib/data/repositories";
import { sendEmail } from "@/lib/services/email.service";
import {
  buildOrderSummaryEmailHtml,
  buildOrderSummaryEmailText,
} from "@/lib/emails/order-summary";
import { notifyAdminsNewOrder } from "@/lib/services/push.service";
import {
  buildOrderSummaryPdfBuffer,
  orderSummaryPdfFilename,
} from "@/lib/orders/order-summary-pdf";

export interface OrderNotifyResult {
  customerEmailSent: boolean;
  adminEmailsSent: number;
  customerNotificationId?: string;
  adminNotificationIds: string[];
  pushSent: boolean;
}

async function getAdminRecipientEmails(): Promise<string[]> {
  const users = await getUsers();
  const adminUsers = users.filter((u) =>
    ["admin", "manager", "staff"].includes(u.role)
  );
  const emails = new Set<string>([
    BRAND.email,
    ...adminUsers.map((u) => u.email).filter(Boolean),
  ]);
  return Array.from(emails);
}

export async function notifyOrderPlaced(
  order: Order,
  customerEmail: string
): Promise<OrderNotifyResult> {
  const result: OrderNotifyResult = {
    customerEmailSent: false,
    adminEmailsSent: 0,
    adminNotificationIds: [],
    pushSent: false,
  };

  const adminEmails = await getAdminRecipientEmails();
  const adminUsers = (await getUsers()).filter((u) =>
    ["admin", "manager", "staff"].includes(u.role)
  );

  const customerSubject = `Order Confirmed — ${order.orderNumber} | ${BRAND.name}`;
  const adminSubject = `New Order ${order.orderNumber} — ${formatPrice(order.total)} | ${BRAND.name}`;

  const pdfBuffer = await buildOrderSummaryPdfBuffer(order);
  const pdfAttachment = {
    filename: orderSummaryPdfFilename(order),
    content: pdfBuffer,
    contentType: "application/pdf" as const,
  };

  const [customerEmailOk, adminEmailOk] = await Promise.all([
    customerEmail.includes("@")
      ? sendEmail({
          to: customerEmail,
          subject: customerSubject,
          html: buildOrderSummaryEmailHtml(order, { customerEmail }),
          text: buildOrderSummaryEmailText(order),
          attachments: [pdfAttachment],
        })
      : Promise.resolve(false),
    sendEmail({
      to: adminEmails,
      subject: adminSubject,
      html: buildOrderSummaryEmailHtml(order, { forAdmin: true, customerEmail }),
      text: buildOrderSummaryEmailText(order, { forAdmin: true }),
      attachments: [pdfAttachment],
    }),
  ]);

  result.customerEmailSent = customerEmailOk;
  result.adminEmailsSent = adminEmailOk ? adminEmails.length : 0;

  const customerNotif = await createNotification({
    id: crypto.randomUUID(),
    userId: order.userId,
    audience: "customer",
    type: "order_placed",
    title: "Order placed successfully",
    body: `${order.orderNumber} — ${formatPrice(order.total)}. We'll notify you when it ships.`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    link: `/dashboard/orders`,
    read: false,
    emailSent: customerEmailOk,
    pushSent: false,
    createdAt: new Date().toISOString(),
  });
  result.customerNotificationId = customerNotif.id;

  for (const admin of adminUsers) {
    const notif = await createNotification({
      id: crypto.randomUUID(),
      userId: admin.id,
      audience: "admin",
      type: "order_placed",
      title: "New order received",
      body: `${order.orderNumber} · ${order.shippingAddress.fullName} · ${formatPrice(order.total)}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      link: `/admin/orders`,
      read: false,
      emailSent: adminEmailOk,
      pushSent: false,
      createdAt: new Date().toISOString(),
    });
    result.adminNotificationIds.push(notif.id);
  }

  try {
    await notifyAdminsNewOrder(order);
    result.pushSent = true;
    await Promise.all(
      result.adminNotificationIds.map((id) => updateNotification(id, { pushSent: true }))
    );
  } catch {
    result.pushSent = false;
  }

  return result;
}
