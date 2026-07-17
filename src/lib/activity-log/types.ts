import type { UserRole } from "@/types";

export type ActivityCategory =
  | "auth"
  | "order"
  | "admin"
  | "contact"
  | "booking"
  | "newsletter"
  | "settings"
  | "media"
  | "system";

export type ActivityStatus = "success" | "failure";

export interface ActivityLog {
  id: string;
  action: string;
  category: ActivityCategory;
  status: ActivityStatus;
  message: string;
  actorId?: string;
  actorEmail?: string;
  actorName?: string;
  actorRole?: UserRole | string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  path?: string;
  createdAt: string;
}

export interface ActivityLogQuery {
  category?: ActivityCategory | "";
  status?: ActivityStatus | "";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface ActivityLogPage {
  items: ActivityLog[];
  total: number;
  limit: number;
  offset: number;
}

export interface LogActivityInput {
  action: string;
  category: ActivityCategory;
  status?: ActivityStatus;
  message: string;
  actorId?: string;
  actorEmail?: string;
  actorName?: string;
  actorRole?: UserRole | string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  path?: string;
}

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  auth: "Authentication",
  order: "Orders",
  admin: "Admin CRUD",
  contact: "Contact",
  booking: "Bookings",
  newsletter: "Newsletter",
  settings: "Settings & Config",
  media: "Media",
  system: "System",
};

export const MAX_ACTIVITY_LOGS = 2500;
