import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET, JWT_EXPIRES_IN } from "@/lib/auth/config";
import type { User, UserRole } from "@/types";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}

const secret = new TextEncoder().encode(JWT_SECRET);

function parseExpiry(exp: string): string | number {
  if (/^\d+[dhms]$/.test(exp)) {
    const num = parseInt(exp, 10);
    const unit = exp.slice(-1);
    const multipliers: Record<string, number> = { d: 86400, h: 3600, m: 60, s: 1 };
    return `${num * (multipliers[unit] || 86400)}s`;
  }
  return exp;
}

export async function signToken(user: User): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(parseExpiry(JWT_EXPIRES_IN))
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
