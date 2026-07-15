import { listUploadedFiles, uploadFile } from "@/lib/uploads/storage";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await listUploadedFiles(), 200, 0);
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return fail("No file provided", 400);
    }

    const resize = form.get("resize") === "true";
    const maxWidth = Number(form.get("maxWidth")) || undefined;
    const maxHeight = Number(form.get("maxHeight")) || undefined;
    const quality = Number(form.get("quality")) || undefined;

    const record = await uploadFile(file, {
      resize,
      maxWidth: maxWidth && maxWidth > 0 ? maxWidth : undefined,
      maxHeight: maxHeight && maxHeight > 0 ? maxHeight : undefined,
      quality,
    });

    return ok(record, 201, 0);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Upload failed", 400);
  }
}
