import { getReviews } from "@/lib/data/repositories";
import { ok } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId") || undefined;
  return ok(await getReviews(productId));
}
