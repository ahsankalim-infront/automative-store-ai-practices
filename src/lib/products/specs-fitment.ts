import type { ProductSpecification, VehicleCompatibility, VehicleMake, VehicleModel } from "@/types";

export function emptySpecification(): ProductSpecification {
  return { id: crypto.randomUUID(), label: "", value: "" };
}

export function emptyVehicleFit(): VehicleCompatibility {
  return {
    id: crypto.randomUUID(),
    brand: "",
    model: "",
    yearFrom: new Date().getFullYear(),
    yearTo: new Date().getFullYear(),
    variants: [],
  };
}

export function parseSpecifications(input: unknown): ProductSpecification[] {
  if (!input) return [];
  if (typeof input === "string") {
    try {
      return parseSpecifications(JSON.parse(input));
    } catch {
      return [];
    }
  }
  if (!Array.isArray(input)) return [];

  const result: ProductSpecification[] = [];
  for (const row of input) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const label = String(r.label ?? "").trim();
    const value = String(r.value ?? "").trim();
    if (!label && !value) continue;
    result.push({
      id: String(r.id ?? crypto.randomUUID()),
      label,
      value,
    });
  }
  return result;
}

export function parseVehicleCompatibility(
  input: unknown,
  vehicleMakes: VehicleMake[] = []
): VehicleCompatibility[] {
  if (!input) return [];
  if (typeof input === "string") {
    try {
      return parseVehicleCompatibility(JSON.parse(input), vehicleMakes);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(input)) return [];

  const result: VehicleCompatibility[] = [];
  for (const row of input) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const brand = String(r.brand ?? "").trim();
    const model = String(r.model ?? "").trim();
    if (!brand || !model) continue;

    let yearFrom = Number(r.yearFrom) || new Date().getFullYear();
    let yearTo = Number(r.yearTo) || yearFrom;
    if (yearFrom > yearTo) [yearFrom, yearTo] = [yearTo, yearFrom];

    const makeSlug = String(r.makeSlug ?? r.vehicleMakeId ?? "").trim() || undefined;
    const modelSlug = String(r.modelSlug ?? r.vehicleModelId ?? "").trim() || undefined;

    const matchedMake = vehicleMakes.find(
      (m) => m.slug === makeSlug || m.id === makeSlug || m.name === brand
    );
    const matchedModel = matchedMake?.models.find(
      (m) => m.slug === modelSlug || m.id === modelSlug || m.name === model
    );

    if (matchedModel?.years?.length) {
      const minY = Math.min(...matchedModel.years);
      const maxY = Math.max(...matchedModel.years);
      yearFrom = Math.max(minY, Math.min(yearFrom, maxY));
      yearTo = Math.max(minY, Math.min(yearTo, maxY));
      if (yearFrom > yearTo) yearFrom = yearTo;
    }

    const variantsRaw = r.variants;
    const variants = Array.isArray(variantsRaw)
      ? variantsRaw.map(String).filter(Boolean)
      : typeof variantsRaw === "string"
        ? variantsRaw.split(",").map((v) => v.trim()).filter(Boolean)
        : undefined;

    result.push({
      id: String(r.id ?? crypto.randomUUID()),
      brand: matchedMake?.name ?? brand,
      model: matchedModel?.name ?? model,
      makeSlug: matchedMake?.slug ?? makeSlug,
      modelSlug: matchedModel?.slug ?? modelSlug,
      vehicleMakeId: matchedMake?.id ?? (r.vehicleMakeId as string | undefined),
      vehicleModelId: matchedModel?.id ?? (r.vehicleModelId as string | undefined),
      yearFrom,
      yearTo,
      variants: variants?.length ? variants : undefined,
    });
  }
  return result;
}

export function resolveVehicleModel(
  makes: VehicleMake[],
  makeKey: string,
  modelKey: string
): { make: VehicleMake; model: VehicleModel } | null {
  const make = makes.find((m) => m.id === makeKey || m.slug === makeKey);
  if (!make) return null;
  const model = make.models.find((m) => m.id === modelKey || m.slug === modelKey);
  if (!model) return null;
  return { make, model };
}

export function formatFitmentYears(fit: VehicleCompatibility): string {
  return fit.yearFrom === fit.yearTo
    ? String(fit.yearFrom)
    : `${fit.yearFrom}–${fit.yearTo}`;
}
