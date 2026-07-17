import { deleteUploadedFile } from "@/lib/uploads/storage";
import { ok, fail, notFound, requireAdmin } from "@/lib/api/helpers";
import { logActivityFromRequest, actorFromJwt } from "@/lib/activity-log";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const deleted = await deleteUploadedFile(id);
  if (!deleted) return notFound("File not found");

  await logActivityFromRequest(request, {
    action: "media.delete",
    category: "media",
    message: `Deleted file #${id}`,
    ...actorFromJwt(auth),
    entityType: "file",
    entityId: id,
  });

  return ok({ deleted: true }, 200, 0);
}
