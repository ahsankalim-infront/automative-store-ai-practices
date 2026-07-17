import { getAdminResource } from "@/lib/admin/resource-registry";
import { revalidateCatalogTag } from "@/lib/data/cached-reads";
import { ok, fail, notFound, requireAdmin } from "@/lib/api/helpers";
import { logAdminResourceAction } from "@/lib/activity-log/admin-crud";

export async function GET(_: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const auth = await requireAdmin(_);
  if (auth instanceof Response) return auth;

  const { resource, id } = await params;
  const ops = getAdminResource(resource);
  if (!ops) return notFound("Unknown resource");

  const item = await ops.get(id);
  if (!item) return notFound("Record not found");
  return ok(item);
}

export async function PUT(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { resource, id } = await params;
  const ops = getAdminResource(resource);
  if (!ops) return notFound("Unknown resource");

  try {
    const body = await request.json();
    const item = await ops.update(id, body);
    if (!item) return notFound("Record not found");
    revalidateCatalogTag(resource);
    await logAdminResourceAction(request, auth, resource, "update", id);
    return ok(item);
  } catch (e) {
    await logAdminResourceAction(request, auth, resource, "update", id, "failure");
    return fail(e instanceof Error ? e.message : "Update failed", 400);
  }
}

export async function PATCH(request: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  return PUT(request, ctx);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { resource, id } = await params;
  const ops = getAdminResource(resource);
  if (!ops?.delete) return fail("Delete not allowed for this resource", 405);

  const deleted = await ops.delete(id);
  if (!deleted) return notFound("Record not found");
  revalidateCatalogTag(resource);
  await logAdminResourceAction(request, auth, resource, "delete", id);
  return ok({ deleted: true });
}
