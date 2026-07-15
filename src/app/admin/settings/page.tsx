"use client";

import { useState, useEffect } from "react";
import { Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    standardShipping: 100,
    expressShipping: 250,
    freeShippingThreshold: 1500,
    currency: "PKR",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.adminGetSettings().then((res) => {
      if (res.success && res.data) {
        setForm({
          storeName: String(res.data.storeName || ""),
          supportEmail: String(res.data.supportEmail || ""),
          supportPhone: String(res.data.supportPhone || ""),
          standardShipping: Number(res.data.standardShipping) || 100,
          expressShipping: Number(res.data.expressShipping) || 250,
          freeShippingThreshold: Number(res.data.freeShippingThreshold) || 1500,
          currency: String(res.data.currency || "PKR"),
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await api.adminUpdateSettings(form);
    if (res.success) toast.success("Settings saved");
    else toast.error(res.error || "Save failed");
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  if (loading) return <p className="text-gray-500">Loading settings...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-foreground">Store Settings</h1>
        <p className="text-sm text-gray-500">Configure global store options</p>
      </div>

      <Card padding="md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">General</p>
            <p className="text-xs text-gray-500">Basic store information</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "storeName", label: "Store Name", type: "text" },
            { key: "supportEmail", label: "Support Email", type: "email" },
            { key: "supportPhone", label: "Support Phone", type: "text" },
            { key: "currency", label: "Currency", type: "text" },
            { key: "standardShipping", label: "Standard Shipping (Rs.)", type: "number" },
            { key: "expressShipping", label: "Express Shipping (Rs.)", type: "number" },
            { key: "freeShippingThreshold", label: "Free Shipping Above (Rs.)", type: "number" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input
                type={type}
                value={String(form[key as keyof typeof form])}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [key]: type === "number" ? Number(e.target.value) : e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button loading={saving} leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
