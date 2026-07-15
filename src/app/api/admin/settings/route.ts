import { getStoreSettings, updateStoreSettings } from "@/lib/admin/resource-registry";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getStoreSettings());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    return ok(await updateStoreSettings(body));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 400);
  }
}
