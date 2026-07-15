"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/logo";
import { useAuthStore } from "@/store/auth-store";

const ADMIN_ROLES = ["admin", "manager", "staff"];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");
    const result = await login(email, password);
    if (result.ok) {
      toast.success("Welcome back! Logged in successfully.");
      const isAdmin = result.user && ADMIN_ROLES.includes(result.user.role);
      router.replace(isAdmin ? "/admin" : "/dashboard");
    } else {
      toast.error(result.error || "Login failed");
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
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ahmed@email.com" leftIcon={<Mail className="h-4 w-4" />} />
            <div className="relative">
              <Input label="Password" type={showPw ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={<button type="button" onClick={() => setShowPw(!showPw)} className="cursor-pointer">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-border text-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button fullWidth size="lg" loading={isLoading} leftIcon={<LogIn className="h-4 w-4" />}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Demo: ahmed@email.com / Customer@123
          </p>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
