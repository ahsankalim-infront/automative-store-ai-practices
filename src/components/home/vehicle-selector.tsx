"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppImage as Image } from "@/components/ui/app-image";
import { LogoMark } from "@/components/brand/logo";
import { Car, ChevronDown, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useVehicleStore } from "@/store/vehicle-store";
import type { VehicleMake } from "@/types";

export function VehicleSelector({ vehicleMakes }: { vehicleMakes: VehicleMake[] }) {
  const router = useRouter();
  const { setVehicle, selectedVehicle, clearVehicle } = useVehicleStore();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const selectedMake = vehicleMakes.find(m => m.slug === make);
  const selectedModel = selectedMake?.models.find(m => m.slug === model);

  const handleSearch = () => {
    if (!make || !model || !year) return;
    const makeData = vehicleMakes.find(m => m.slug === make)!;
    const modelData = makeData.models.find(m => m.slug === model)!;
    setVehicle({ make: makeData.name, makeSlug: make, model: modelData.name, modelSlug: model, year: parseInt(year) });
    router.push(`/products?make=${make}&model=${model}&year=${year}`);
  };

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-[#1a0505] to-secondary" />
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&h=600&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />

      <div className="relative max-w-screen-xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Smart Vehicle Search
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
              Find Parts That<br />Fit Your Car
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
              Select your vehicle and we&apos;ll show only compatible products —
              no guesswork, no wrong fitments.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {vehicleMakes.slice(0, 6).map(m => (
                <button
                  key={m.id}
                  onClick={() => { setMake(m.slug); setModel(""); setYear(""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${make === m.slug ? "bg-primary text-white border-primary" : "border-white/20 text-gray-400 hover:border-white/40 hover:text-white"}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5 sm:p-7 bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <LogoMark size="md" />
              <div>
                <p className="text-sm font-bold text-white">Select Your Vehicle</p>
                <p className="text-xs text-gray-400">Make → Model → Year</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Make", value: make, onChange: (v: string) => { setMake(v); setModel(""); setYear(""); }, disabled: false, options: vehicleMakes.map(m => ({ value: m.slug, label: m.name })) },
                { label: "Model", value: model, onChange: (v: string) => { setModel(v); setYear(""); }, disabled: !make, options: selectedMake?.models.map(m => ({ value: m.slug, label: m.name })) ?? [] },
                { label: "Year", value: year, onChange: setYear, disabled: !model, options: selectedModel?.years.sort((a, b) => b - a).map(y => ({ value: String(y), label: String(y) })) ?? [] },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                  <div className="relative">
                    <select
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      disabled={field.disabled}
                      className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="" className="text-gray-900">Select {field.label}</option>
                      {field.options.map(o => (
                        <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleSearch}
              disabled={!make || !model || !year}
              leftIcon={<Search className="h-5 w-5" />}
            >
              Find Compatible Products
            </Button>

            {selectedVehicle && (
              <div className="mt-3 flex items-center justify-between bg-primary/15 border border-primary/25 rounded-xl px-4 py-2.5 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Car className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-white font-medium truncate">
                    {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year}
                  </span>
                </div>
                <button onClick={clearVehicle} className="text-xs text-gray-400 hover:text-white transition-colors shrink-0">Clear</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
