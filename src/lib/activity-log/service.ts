import { createActivityLog } from "@/lib/data/repositories";
import type { LogActivityInput } from "./types";
import { getRequestMeta } from "./request";

/** Persist an activity log entry; failures are swallowed so logging never breaks the main flow. */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    await createActivityLog({
      id: crypto.randomUUID(),
      status: input.status ?? "success",
      createdAt: new Date().toISOString(),
      ...input,
    });
  } catch (error) {
    console.error("[activity-log] failed to write log:", error);
  }
}

export async function logActivityFromRequest(
  request: Request,
  input: LogActivityInput
): Promise<void> {
  await logActivity({ ...input, ...getRequestMeta(request) });
}
