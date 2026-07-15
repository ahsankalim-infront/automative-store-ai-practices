import { getVapidPublicKey, isPushConfigured } from "@/lib/services/push.service";
import { ok } from "@/lib/api/helpers";

export async function GET() {
  return ok({
    publicKey: getVapidPublicKey(),
    configured: isPushConfigured(),
  });
}
