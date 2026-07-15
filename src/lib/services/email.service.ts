import nodemailer from "nodemailer";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
}

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@shahzadposhish.com";

export function isEmailConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function appendToOutbox(entry: Record<string, unknown>) {
  const dir = join(process.cwd(), "data", "json");
  const file = join(dir, "email-outbox.json");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  let items: Record<string, unknown>[] = [];
  if (existsSync(file)) {
    try {
      items = JSON.parse(readFileSync(file, "utf-8")) as Record<string, unknown>[];
    } catch {
      items = [];
    }
  }
  items.unshift({ ...entry, queuedAt: new Date().toISOString() });
  writeFileSync(file, JSON.stringify(items.slice(0, 100), null, 2), "utf-8");
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  const validRecipients = recipients.filter((e) => e && e.includes("@"));
  if (!validRecipients.length) return false;

  if (!isEmailConfigured()) {
    appendToOutbox({
      to: validRecipients,
      subject: input.subject,
      preview: input.text?.slice(0, 200) || input.subject,
      attachments: input.attachments?.map((a) => a.filename) ?? [],
      mode: "outbox-dev",
    });
    console.info(`[email] SMTP not configured — saved to email-outbox.json → ${validRecipients.join(", ")}: ${input.subject}`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: validRecipients.join(", "),
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType || "application/octet-stream",
      })),
    });
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}
