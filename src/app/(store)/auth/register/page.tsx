"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { BRAND } from "@/lib/brand/config";
import { BrandLogo } from "@/components/brand/logo";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Please fill all required fields");
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    if (result.ok) {
      toast.success(`Account created! Welcome to ${BRAND.name}`);
      router.push("/dashboard");
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex justify-center mb-6">
              <BrandLogo size="lg" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Shop poshish & seat covers with us</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Ahmed Khan" leftIcon={<User className="h-4 w-4" />} />
            <Input label="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="ahmed@email.com" leftIcon={<Mail className="h-4 w-4" />} />
            <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="0300-1234567" leftIcon={<Phone className="h-4 w-4" />} />
            <Input label="Password *" type={showPw ? "text" : "password"} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
            />
            <Input label="Confirm Password *" type="password" value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              leftIcon={<Lock className="h-4 w-4" />}
              error={form.confirm && form.password !== form.confirm ? "Passwords do not match" : ""}
            />
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-border text-primary" />
              <span className="text-xs text-gray-500">I agree to the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
            </label>
            <Button fullWidth size="lg" loading={isLoading} leftIcon={<UserPlus className="h-4 w-4" />}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
