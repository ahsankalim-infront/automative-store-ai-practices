"use client";
import { useState } from "react";
import { MapPin, Phone, Clock, ChevronRight, Search, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useStores } from "@/hooks/use-api-data";

export default function StoreLocatorPage() {
  const { data: stores = [] } = useStores();
  const cities = [...new Set(stores.map(s => s.city))];
  const [selectedCity, setSelectedCity] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = stores.filter(s =>
    (selectedCity === "All" || s.city === selectedCity) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Store Locator" }]} className="mb-6" />
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-foreground mb-3">Find a Store</h1>
          <p className="text-gray-500">18+ branches across Pakistan. Visit us for expert advice, installation, and services.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by city or branch name..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-card dark:text-white" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...cities].map(city => (
              <button key={city} onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedCity === city ? "bg-primary text-white border-primary" : "border-border text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary"}`}>
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Store Map Placeholder */}
        <div className="bg-gray-900 rounded-2xl h-64 flex items-center justify-center mb-8 relative overflow-hidden">
          <div className="text-center text-gray-400">
            <MapPin className="h-10 w-10 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Interactive Map</p>
            <p className="text-xs text-gray-500">Google Maps integration ready</p>
          </div>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>

        <p className="text-sm text-gray-500 mb-4"><span className="font-semibold text-foreground">{filtered.length}</span> branches found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((store, i) => (
            <motion.div key={store.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all group">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all">
                  <MapPin className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{store.name}</h3>
                  {store.isMainBranch && <span className="text-xs text-primary font-semibold">Main Branch</span>}
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" />{store.address}</p>
                <a href={`tel:${store.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 shrink-0" />{store.phone}
                </a>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" />{store.hours}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {store.services.slice(0, 4).map(svc => (
                  <span key={svc} className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-gray-800 border border-border rounded-full text-gray-500">{svc}</span>
                ))}
              </div>
              <button className="mt-3 flex items-center gap-1 text-xs text-primary font-semibold hover:gap-2 transition-all">
                Get Directions <ChevronRight className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
