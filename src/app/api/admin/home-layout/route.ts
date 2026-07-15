import { getHomeLayout, updateHomeLayout } from "@/lib/home-layout/config";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getHomeLayout());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    return ok(
      await updateHomeLayout({
        desktop: body.desktop,
        mobile: body.mobile,
      })
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Home layout update failed", 400);
  }
}
