import { getBanners } from "@/lib/data/repositories";
import { ok } from "@/lib/api/helpers";
import type { Banner } from "@/types";

export async function GET(request: Request) {
  const position = new URL(request.url).searchParams.get("position") as Banner["position"] | null;
  return ok(await getBanners(position || undefined));
}
