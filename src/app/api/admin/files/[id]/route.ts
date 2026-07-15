import { deleteUploadedFile } from "@/lib/uploads/storage";
import { ok, fail, notFound, requireAdmin } from "@/lib/api/helpers";

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

  return ok({ deleted: true }, 200, 0);
}
