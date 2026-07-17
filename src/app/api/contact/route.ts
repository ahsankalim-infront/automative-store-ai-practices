import { createContactMessage } from "@/lib/data/repositories";
import { ok, fail } from "@/lib/api/helpers";
import { logActivityFromRequest } from "@/lib/activity-log";

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    if (!name || !phone || !subject || !message) {
      return fail("Name, phone, subject, and message are required");
    }
    const msg = await createContactMessage({
      id: crypto.randomUUID(),
      name,
      email: email || "",
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });
    await logActivityFromRequest(request, {
      action: "contact.submit",
      category: "contact",
      message: `Contact form: ${subject}`,
      actorName: name,
      actorEmail: email || undefined,
      entityType: "contact-message",
      entityId: msg.id,
      metadata: { phone, subject },
    });
    return ok({ id: msg.id }, 201);
  } catch (e) {
    await logActivityFromRequest(request, {
      action: "contact.submit",
      category: "contact",
      status: "failure",
      message: "Contact form submission failed",
    });
    return fail(e instanceof Error ? e.message : "Failed to send message", 500);
  }
}
