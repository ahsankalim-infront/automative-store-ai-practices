"use client";

import { useEffect, useState } from "react";
import { Save, Package } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminCrudPanel } from "@/components/admin/admin-crud-panel";
import { getEntityConfig } from "@/lib/admin/entity-configs";
import { api } from "@/lib/api/client";
import type { BundleOffersSectionConfig } from "@/types";

export function AdminBundleOffersPage() {
  const offersConfig = getEntityConfig("bundleOffers");
  const [section, setSection] = useState<BundleOffersSectionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.adminGetBundleOffersSection().then((res) => {
      if (res.success && res.data) setSection(res.data as BundleOffersSectionConfig);
      setLoading(false);
    });
  }, []);

  const handleSaveSection = async () => {
    if (!section) return;
    setSaving(true);
    const res = await api.adminUpdateBundleOffersSection(section);
    if (res.success) toast.success("Section settings saved");
    else toast.error(res.error || "Save failed");
    setSaving(false);
  };

  if (!offersConfig) {
    return <p className="text-red-500">Bundle offers config missing</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Bundle Offers
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the homepage bundle section heading and individual bundle cards. Changes appear on the store within about a minute.
        </p>
      </div>

      <Card padding="md">
        <h2 className="font-bold text-foreground mb-4">Section Header</h2>
        {loading || !section ? (
          <p className="text-sm text-gray-500">Loading section settings...</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-gray-500 mb-1.5 block">Enabled on homepage</span>
              <input
                type="checkbox"
                checked={section.isEnabled}
                onChange={(e) => setSection({ ...section, isEnabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1.5 block">Badge</span>
              <input
                value={section.badge}
                onChange={(e) => setSection({ ...section, badge: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1.5 block">Title</span>
              <input
                value={section.title}
                onChange={(e) => setSection({ ...section, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-gray-500 mb-1.5 block">Subtitle</span>
              <input
                value={section.subtitle}
                onChange={(e) => setSection({ ...section, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-gray-500 mb-1.5 block">View All Link</span>
              <input
                value={section.viewAllHref}
                onChange={(e) => setSection({ ...section, viewAllHref: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card"
                placeholder="/products"
              />
            </label>
            <div className="sm:col-span-2">
              <Button onClick={handleSaveSection} loading={saving} leftIcon={<Save className="h-4 w-4" />}>
                Save Section Settings
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AdminCrudPanel config={offersConfig} />
    </div>
  );
}
