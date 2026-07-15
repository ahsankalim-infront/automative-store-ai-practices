import {
  getUserByEmail,
  createUser,
  toPublicUser,
  type UserRecord,
} from "@/lib/data/repositories";
import { hashPassword, comparePassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { isAdminRole } from "@/lib/api/helpers";
import type { User, UserRole } from "@/types";

export interface AuthResult {
  user: User;
  token: string;
}

export async function registerUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResult> {
  const existing = await getUserByEmail(input.email);
  if (existing) throw new Error("Email already registered");

  const user: UserRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    role: "customer",
    passwordHash: await hashPassword(input.password),
    addresses: [],
    createdAt: new Date().toISOString(),
    isVerified: false,
  };

  await createUser(user);
  const publicUser = toPublicUser(user);
  const token = await signToken(publicUser);
  return { user: publicUser, token };
}

export async function loginUser(
  email: string,
  password: string,
  allowedRoles?: UserRole[]
): Promise<AuthResult> {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("You do not have access to this portal");
  }

  const publicUser = toPublicUser(user);
  const token = await signToken(publicUser);
  return { user: publicUser, token };
}

export async function loginAdmin(email: string, password: string): Promise<AuthResult> {
  const result = await loginUser(email, password);
  if (!isAdminRole(result.user.role)) {
    throw new Error("Admin access required");
  }
  return result;
}
