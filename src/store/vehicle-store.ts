"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectedVehicle } from "@/types";

interface VehicleStore {
  selectedVehicle: SelectedVehicle | null;
  setVehicle: (vehicle: SelectedVehicle) => void;
  clearVehicle: () => void;
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set) => ({
      selectedVehicle: null,
      setVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      clearVehicle: () => set({ selectedVehicle: null }),
    }),
    { name: "autozone-vehicle" }
  )
);
