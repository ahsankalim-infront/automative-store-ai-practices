import { getVehicleMakes } from "@/lib/data/repositories";
import { ok } from "@/lib/api/helpers";

export async function GET() {
  return ok(await getVehicleMakes());
}
