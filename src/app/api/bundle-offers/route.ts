import { getBundleOffers } from "@/lib/data/repositories";
import { getBundleOffersSection } from "@/lib/bundles/config";
import { ok } from "@/lib/api/helpers";

export async function GET() {
  const [section, offers] = await Promise.all([getBundleOffersSection(), getBundleOffers()]);
  if (!section.isEnabled) {
    return ok({ section, offers: [] });
  }
  return ok({ section, offers });
}
