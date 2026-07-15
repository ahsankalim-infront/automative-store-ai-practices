"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/logo";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const adminLogin = useAuthStore((s) => s.adminLogin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");
    const result = await adminLogin(email, password);
    if (result.ok) {
      toast.success("Welcome, Admin!");
      router.replace("/admin");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BrandLogo
                size="lg"
                className="justify-center"
                textClassName="text-left [&_p:first-child]:text-white [&_p:last-child]:text-gray-400"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">Admin portal — manage your store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@autozone.pk"
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <Button fullWidth size="lg" loading={isLoading} leftIcon={<Shield className="h-4 w-4" />}>
              Sign In to Admin
            </Button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-4">
            Demo: admin@autozone.pk / Admin@123
          </p>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/" className="text-primary hover:underline">← Back to store</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
