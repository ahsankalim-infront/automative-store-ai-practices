import { getPromotionPopup } from "@/lib/data/repositories";
import { ok } from "@/lib/api/helpers";

export async function GET() {
  const popup = await getPromotionPopup();
  return ok(popup, 200, 60);
}
