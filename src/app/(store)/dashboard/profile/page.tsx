"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api/client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone || "" });
    }
  }, [user]);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-PK", { month: "long", year: "numeric" })
    : null;

  const handleSave = async () => {
    setLoading(true);
    const res = await api.updateProfile({ name: form.name, phone: form.phone });
    setLoading(false);
    if (res.success && res.data) {
      if (token) setAuth(res.data, token);
      toast.success("Profile updated!");
    } else {
      toast.error(res.error || "Update failed");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.next) return toast.error("Fill in all password fields");
    if (passwords.next !== passwords.confirm) return toast.error("New passwords do not match");
    if (passwords.next.length < 6) return toast.error("Password must be at least 6 characters");

    setPwLoading(true);
    const res = await api.updateProfile({
      currentPassword: passwords.current,
      newPassword: passwords.next,
    } as Parameters<typeof api.updateProfile>[0]);
    setPwLoading(false);

    if (res.success) {
      toast.success("Password updated!");
      setPasswords({ current: "", next: "", confirm: "" });
    } else {
      toast.error(res.error || "Password update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-foreground">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your personal information and password.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 space-y-5">
        <div className="flex flex-col xs:flex-row xs:items-center gap-4">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black">
              {form.name.charAt(0)?.toUpperCase() || "U"}
            </div>
            <button type="button" className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-primary transition-colors" aria-label="Change avatar">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="font-bold text-foreground">{form.name || "Customer"}</p>
            <p className="text-sm text-gray-400">{memberSince ? `Member since ${memberSince}` : user?.email}</p>
            {user?.loyaltyPoints != null && user.loyaltyPoints > 0 && (
              <p className="text-xs text-primary font-semibold mt-1">{user.loyaltyPoints} loyalty points</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} leftIcon={<User className="h-4 w-4" />} />
          <Input label="Email" type="email" value={form.email} disabled leftIcon={<Mail className="h-4 w-4" />} />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} leftIcon={<Phone className="h-4 w-4" />} />
        </div>

        <Button loading={loading} onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
        <h3 className="font-bold text-foreground mb-1">Change Password</h3>
        <p className="text-sm text-gray-500 mb-4">Use a strong password you don&apos;t use elsewhere.</p>
        <div className="space-y-3 max-w-md">
          <Input label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" />
          <Input label="New Password" type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} placeholder="••••••••" />
          <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" />
          <Button variant="outline" loading={pwLoading} onClick={handlePasswordChange}>Update Password</Button>
        </div>
      </div>
    </div>
  );
}
