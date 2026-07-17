import { getAdminResource, ADMIN_RESOURCE_KEYS } from "@/lib/admin/resource-registry";
import { revalidateCatalogTag } from "@/lib/data/cached-reads";
import { ok, fail, notFound, requireAdmin } from "@/lib/api/helpers";
import { logAdminResourceAction } from "@/lib/activity-log/admin-crud";

export async function GET(_: Request, { params }: { params: Promise<{ resource: string }> }) {
  const auth = await requireAdmin(_);
  if (auth instanceof Response) return auth;

  const { resource } = await params;
  if (!ADMIN_RESOURCE_KEYS.includes(resource as never)) return notFound("Unknown resource");

  const ops = getAdminResource(resource);
  if (!ops) return notFound("Unknown resource");

  const items = await ops.list();
  return ok(items);
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { resource } = await params;
  const ops = getAdminResource(resource);
  if (!ops?.create) return fail("Create not allowed for this resource", 405);

  try {
    const body = await request.json();
    const item = await ops.create(body);
    revalidateCatalogTag(resource);
    const entityId = typeof item === "object" && item && "id" in item ? String(item.id) : undefined;
    await logAdminResourceAction(request, auth, resource, "create", entityId);
    return ok(item, 201);
  } catch (e) {
    await logAdminResourceAction(request, auth, resource, "create", undefined, "failure");
    return fail(e instanceof Error ? e.message : "Create failed", 400);
  }
}
