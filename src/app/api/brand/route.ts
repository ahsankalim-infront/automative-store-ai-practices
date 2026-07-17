import { getBrandConfig } from "@/lib/brand/get-brand-config";
import { ok } from "@/lib/api/helpers";

export async function GET() {
  return ok(await getBrandConfig());
}
