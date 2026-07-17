import { getAboutPageContent } from "@/lib/about-content";
import { ok } from "@/lib/api/helpers";

export async function GET() {
  return ok(await getAboutPageContent());
}
