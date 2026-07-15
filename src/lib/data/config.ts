import path from "path";

export type DataSourceType = "json" | "mysql";

export function getDataSource(): DataSourceType {
  const source = process.env.DATA_SOURCE?.toLowerCase();
  return source === "mysql" ? "mysql" : "json";
}

export const JSON_DATA_DIR = path.join(process.cwd(), "data", "json");
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const ADMIN_ROLES = ["admin", "manager", "staff"] as const;
