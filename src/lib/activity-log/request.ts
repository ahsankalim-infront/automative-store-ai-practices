import type { JwtPayload } from "@/lib/auth/jwt";
import type { LogActivityInput } from "./types";

export function getRequestMeta(request: Request): Pick<LogActivityInput, "ip" | "userAgent" | "path"> {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;
  const userAgent = request.headers.get("user-agent") || undefined;

  let path: string | undefined;
  try {
    path = new URL(request.url).pathname;
  } catch {
    path = undefined;
  }

  return { ip, userAgent, path };
}

export function actorFromJwt(auth: JwtPayload): Pick<
  LogActivityInput,
  "actorId" | "actorEmail" | "actorName" | "actorRole"
> {
  return {
    actorId: auth.sub,
    actorEmail: auth.email,
    actorName: auth.name,
    actorRole: auth.role,
  };
}

export function summarizeBody(body: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}
