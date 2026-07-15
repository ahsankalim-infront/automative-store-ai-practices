"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VehicleCompatibility, VehicleMake } from "@/types";
import { emptyVehicleFit, formatFitmentYears } from "@/lib/products/specs-fitment";

interface ProductVehicleFitEditorProps {
  value: VehicleCompatibility[];
  onChange: (value: VehicleCompatibility[]) => void;
  vehicleMakes: VehicleMake[];
  readOnly?: boolean;
}

export function ProductVehicleFitEditor({
  value,
  onChange,
  vehicleMakes,
  readOnly = false,
}: ProductVehicleFitEditorProps) {
  const rows = value?.length ? value : [];

  const getModels = (makeKey: string) => {
    const make = vehicleMakes.find((m) => m.id === makeKey || m.slug === makeKey);
    return make?.models ?? [];
  };

  const getYearBounds = (makeKey: string, modelKey: string) => {
    const models = getModels(makeKey);
    const model = models.find((m) => m.id === modelKey || m.slug === modelKey);
    if (!model?.years?.length) return { min: 1990, max: new Date().getFullYear() + 1 };
    return { min: Math.min(...model.years), max: Math.max(...model.years) };
  };

  const updateRow = (index: number, patch: Partial<VehicleCompatibility>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const handleMakeChange = (index: number, makeKey: string) => {
    const make = vehicleMakes.find((m) => m.id === makeKey || m.slug === makeKey);
    if (!make) return;
    const firstModel = make.models[0];
    const bounds = firstModel
      ? { min: Math.min(...firstModel.years), max: Math.max(...firstModel.years) }
      : { min: new Date().getFullYear(), max: new Date().getFullYear() };

    updateRow(index, {
      vehicleMakeId: make.id,
      makeSlug: make.slug,
      brand: make.name,
      vehicleModelId: firstModel?.id,
      modelSlug: firstModel?.slug,
      model: firstModel?.name ?? "",
      yearFrom: bounds.min,
      yearTo: bounds.max,
      variants: firstModel?.variants,
    });
  };

  const handleModelChange = (index: number, makeKey: string, modelKey: string) => {
    const make = vehicleMakes.find((m) => m.id === makeKey || m.slug === makeKey);
    const model = make?.models.find((m) => m.id === modelKey || m.slug === modelKey);
    if (!make || !model) return;
    const bounds = getYearBounds(makeKey, modelKey);
    updateRow(index, {
      vehicleMakeId: make.id,
      makeSlug: make.slug,
      brand: make.name,
      vehicleModelId: model.id,
      modelSlug: model.slug,
      model: model.name,
      yearFrom: bounds.min,
      yearTo: bounds.max,
      variants: model.variants,
    });
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    const firstMake = vehicleMakes[0];
    const firstModel = firstMake?.models[0];
    const row = emptyVehicleFit();
    if (firstMake && firstModel) {
      row.vehicleMakeId = firstMake.id;
      row.makeSlug = firstMake.slug;
      row.brand = firstMake.name;
      row.vehicleModelId = firstModel.id;
      row.modelSlug = firstModel.slug;
      row.model = firstModel.name;
      row.yearFrom = Math.min(...firstModel.years);
      row.yearTo = Math.max(...firstModel.years);
      row.variants = firstModel.variants;
    }
    onChange([...rows, row]);
  };

  if (readOnly) {
    if (!rows.length) {
      return <p className="text-sm text-gray-400 py-2">No vehicle fitment — treated as universal fit.</p>;
    }
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
          <span>Make</span><span>Model</span><span>Years</span>
        </div>
        {rows.map((row, i) => (
          <div key={row.id ?? i} className="grid grid-cols-3 gap-2 px-3 py-2 text-sm border-t border-border">
            <span>{row.brand}</span>
            <span>{row.model}</span>
            <span>{formatFitmentYears(row)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Link compatible vehicles from the Vehicle Database. Leave empty if the product is universal fit.
      </p>
      {vehicleMakes.length === 0 ? (
        <p className="text-sm text-amber-600 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          Vehicle database is empty. Add makes/models under Admin → Vehicle Database first.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400 rounded-xl border border-dashed border-border px-4 py-6 text-center">
          No vehicle fitment added. This product will show as universal fit.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => {
            const makeKey = row.vehicleMakeId ?? row.makeSlug ?? "";
            const modelKey = row.vehicleModelId ?? row.modelSlug ?? "";
            const models = getModels(makeKey);
            const bounds = getYearBounds(makeKey, modelKey);

            return (
              <div key={row.id ?? index} className="rounded-xl border border-border p-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={makeKey}
                    onChange={(e) => handleMakeChange(index, e.target.value)}
                    className="px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground"
                  >
                    <option value="">Select make...</option>
                    {vehicleMakes.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <select
                    value={modelKey}
                    onChange={(e) => handleModelChange(index, makeKey, e.target.value)}
                    disabled={!makeKey}
                    className="px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground disabled:opacity-50"
                  >
                    <option value="">Select model...</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 items-end">
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">Year from</label>
                    <input
                      type="number"
                      min={bounds.min}
                      max={bounds.max}
                      value={row.yearFrom}
                      onChange={(e) => updateRow(index, { yearFrom: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">Year to</label>
                    <input
                      type="number"
                      min={bounds.min}
                      max={bounds.max}
                      value={row.yearTo}
                      onChange={(e) => updateRow(index, { yearTo: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 sm:mb-0.5"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => removeRow(index)}
                  >
                    Remove
                  </Button>
                </div>
                {row.variants?.length ? (
                  <p className="text-[11px] text-gray-400">
                    Variants: {row.variants.join(", ")}
                  </p>
                ) : null}
                <p className="text-[11px] text-gray-400">
                  Valid years for {row.model || "model"}: {bounds.min}–{bounds.max}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <Button
        type="button"
        size="sm"
        variant="outline"
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={addRow}
        disabled={vehicleMakes.length === 0}
      >
        Add vehicle fit
      </Button>
    </div>
  );
}
