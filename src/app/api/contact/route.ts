import { createContactMessage } from "@/lib/data/repositories";
import { ok, fail } from "@/lib/api/helpers";

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
    return ok({ id: msg.id }, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Failed to send message", 500);
  }
}
