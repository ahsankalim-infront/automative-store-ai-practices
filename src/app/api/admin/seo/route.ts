import { getSeoConfig, updateSeoConfig } from "@/lib/seo/config";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getSeoConfig());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    return ok(await updateSeoConfig(body));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "SEO update failed", 400);
  }
}
