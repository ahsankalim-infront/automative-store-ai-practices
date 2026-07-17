"use client";

import { useState, useEffect } from "react";
import { Save, Settings, Plus, Trash2, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import toast from "react-hot-toast";
import type { StoreContactPerson } from "@/lib/brand/types";

interface SettingsForm {
  storeName: string;
  shortName: string;
  tagline: string;
  description: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  orderPrefix: string;
  businessHours: string;
  announcementText: string;
  address: string;
  addressCity: string;
  addressProvince: string;
  addressCountry: string;
  contactPersons: StoreContactPerson[];
  standardShipping: number;
  expressShipping: number;
  freeShippingThreshold: number;
  currency: string;
}

const emptyContact = (): StoreContactPerson => ({ name: "", phones: [""] });

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    storeName: "",
    shortName: "",
    tagline: "",
    description: "",
    supportEmail: "",
    supportPhone: "",
    whatsapp: "",
    orderPrefix: "",
    businessHours: "",
    announcementText: "",
    address: "",
    addressCity: "",
    addressProvince: "",
    addressCountry: "",
    contactPersons: [emptyContact()],
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
        const d = res.data as Record<string, unknown>;
        const persons = Array.isArray(d.contactPersons)
          ? (d.contactPersons as StoreContactPerson[]).map((p) => ({
              name: p.name || "",
              phones: p.phones?.length ? p.phones : [""],
            }))
          : [emptyContact()];

        setForm({
          storeName: String(d.storeName || ""),
          shortName: String(d.shortName || ""),
          tagline: String(d.tagline || ""),
          description: String(d.description || ""),
          supportEmail: String(d.supportEmail || ""),
          supportPhone: String(d.supportPhone || ""),
          whatsapp: String(d.whatsapp || ""),
          orderPrefix: String(d.orderPrefix || ""),
          businessHours: String(d.businessHours || ""),
          announcementText: String(d.announcementText || ""),
          address: String(d.address || ""),
          addressCity: String(d.addressCity || ""),
          addressProvince: String(d.addressProvince || ""),
          addressCountry: String(d.addressCountry || ""),
          contactPersons: persons,
          standardShipping: Number(d.standardShipping) || 100,
          expressShipping: Number(d.expressShipping) || 250,
          freeShippingThreshold: Number(d.freeShippingThreshold) || 1500,
          currency: String(d.currency || "PKR"),
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      contactPersons: form.contactPersons
        .map((p) => ({
          name: p.name.trim(),
          phones: p.phones.map((ph) => ph.replace(/\D/g, "")).filter(Boolean),
        }))
        .filter((p) => p.name && p.phones.length > 0),
    };
    const res = await api.adminUpdateSettings(payload);
    if (res.success) toast.success("Settings saved");
    else toast.error(res.error || "Save failed");
    setSaving(false);
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  const updateContact = (index: number, patch: Partial<StoreContactPerson>) => {
    setForm((prev) => {
      const next = [...prev.contactPersons];
      next[index] = { ...next[index], ...patch };
      return { ...prev, contactPersons: next };
    });
  };

  const updateContactPhone = (personIndex: number, phoneIndex: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.contactPersons];
      const phones = [...next[personIndex].phones];
      phones[phoneIndex] = value;
      next[personIndex] = { ...next[personIndex], phones };
      return { ...prev, contactPersons: next };
    });
  };

  if (loading) return <p className="text-gray-500">Loading settings...</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-foreground">Store Settings</h1>
        <p className="text-sm text-gray-500">
          Business profile, contact details, and shipping — shown across the storefront
        </p>
      </div>

      <Card padding="md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">Business Profile</p>
            <p className="text-xs text-gray-500">Store name, tagline, and description</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "storeName", label: "Store Name", type: "text" },
            { key: "shortName", label: "Short Name (logo)", type: "text" },
            { key: "tagline", label: "Tagline", type: "text", span: 2 },
            { key: "description", label: "Description", type: "textarea", span: 2 },
            { key: "announcementText", label: "Announcement Bar Text", type: "text", span: 2 },
            { key: "businessHours", label: "Business Hours", type: "text", span: 2 },
            { key: "orderPrefix", label: "Order Number Prefix", type: "text" },
          ].map(({ key, label, type, span }) => (
            <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              {type === "textarea" ? (
                <textarea
                  rows={3}
                  value={String(form[key as keyof SettingsForm])}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={inputClass}
                />
              ) : (
                <input
                  type={type}
                  value={String(form[key as keyof SettingsForm])}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card padding="md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">Contact & Address</p>
            <p className="text-xs text-gray-500">Phone numbers, email, and office location</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            { key: "supportEmail", label: "Support Email", type: "email" },
            { key: "supportPhone", label: "Primary Phone", type: "text" },
            { key: "whatsapp", label: "WhatsApp (with country code, e.g. 92322...)", type: "text" },
            { key: "addressCity", label: "City", type: "text" },
            { key: "addressProvince", label: "Province", type: "text" },
            { key: "addressCountry", label: "Country", type: "text" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input
                type={type}
                value={String(form[key as keyof SettingsForm])}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className={inputClass}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Contact Persons</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  contactPersons: [...prev.contactPersons, emptyContact()],
                }))
              }
            >
              Add Person
            </Button>
          </div>

          {form.contactPersons.map((person, pi) => (
            <div key={pi} className="p-4 rounded-xl border border-border bg-surface/50 space-y-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updateContact(pi, { name: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Shahzad Ahmed"
                  />
                </div>
                {form.contactPersons.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-6 text-red-500"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        contactPersons: prev.contactPersons.filter((_, i) => i !== pi),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">Phone Numbers</label>
                {person.phones.map((phone, phIdx) => (
                  <div key={phIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => updateContactPhone(pi, phIdx, e.target.value)}
                      className={inputClass}
                      placeholder="0322-4123414"
                    />
                    {person.phones.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 shrink-0"
                        onClick={() =>
                          updateContact(pi, {
                            phones: person.phones.filter((_, i) => i !== phIdx),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() =>
                    updateContact(pi, { phones: [...person.phones, ""] })
                  }
                >
                  Add Phone
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">Shipping & Currency</p>
            <p className="text-xs text-gray-500">Checkout and delivery options</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "currency", label: "Currency", type: "text" },
            { key: "standardShipping", label: "Standard Shipping (Rs.)", type: "number" },
            { key: "expressShipping", label: "Express Shipping (Rs.)", type: "number" },
            { key: "freeShippingThreshold", label: "Free Shipping Above (Rs.)", type: "number" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input
                type={type}
                value={String(form[key as keyof SettingsForm])}
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
