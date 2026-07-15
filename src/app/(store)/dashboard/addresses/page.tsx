"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api/client";
import type { ShippingAddress } from "@/types";
import toast from "react-hot-toast";

const emptyAddress = (): ShippingAddress => ({
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Pakistan",
});

export default function AddressesPage() {
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<ShippingAddress>(emptyAddress());
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    setAddresses(user?.addresses?.length ? [...user.addresses] : []);
  }, [user]);

  const openAdd = () => {
    setDraft(emptyAddress());
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (index: number) => {
    setDraft({ ...addresses[index] });
    setEditing(index);
    setShowForm(true);
  };

  const saveAddresses = async (next: ShippingAddress[]) => {
    setSaving(true);
    const res = await api.updateProfile({ addresses: next });
    setSaving(false);
    if (res.success && res.data && token) {
      useAuthStore.getState().setAuth(res.data, token);
      setAddresses(next);
      toast.success("Addresses saved!");
      setShowForm(false);
      setEditing(null);
    } else {
      toast.error(res.error || "Failed to save");
    }
  };

  const handleSubmit = async () => {
    if (!draft.fullName || !draft.phone || !draft.address || !draft.city) {
      return toast.error("Please fill required fields");
    }
    const next = [...addresses];
    if (editing !== null) next[editing] = draft;
    else next.push(draft);
    await saveAddresses(next);
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Remove this address?")) return;
    const next = addresses.filter((_, i) => i !== index);
    await saveAddresses(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">My Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage shipping addresses for faster checkout.</p>
        </div>
        {!showForm && (
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Address</Button>
        )}
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-primary/30 p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-foreground">{editing !== null ? "Edit Address" : "New Address"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name *" value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
            <Input label="Phone *" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            <Input label="Street Address *" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} className="sm:col-span-2" />
            <Input label="City *" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
            <Input label="State / Province" value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} />
            <Input label="Postal Code" value={draft.postalCode || ""} onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })} />
            <Input label="Country" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button loading={saving} onClick={handleSubmit}>Save Address</Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="bg-card rounded-2xl border border-border p-10 text-center">
          <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">No addresses saved</p>
          <p className="text-sm text-gray-500 mb-4">Add a delivery address for quicker checkout.</p>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Your First Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, i) => (
            <div key={`${addr.address}-${i}`} className="bg-card rounded-2xl border border-border p-5 relative">
              {i === 0 && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3" /> Default
                </span>
              )}
              <p className="font-bold text-foreground pr-16">{addr.fullName}</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {addr.address}<br />
                {addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.postalCode}<br />
                {addr.country}
              </p>
              <p className="text-sm text-gray-400 mt-2">{addr.phone}</p>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => openEdit(i)}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-red-600" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => handleDelete(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
