"use client";

import { AppImage as Image } from "@/components/ui/app-image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Gift, Bell, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    const res = await api.newsletter(email);
    if (res.success) {
      toast.success("Subscribed! Check your inbox for 10% off.");
      setEmail("");
    } else {
      toast.error(res.error || "Subscription failed");
    }
    setLoading(false);
  };

  return (
    <section className="py-16 sm:py-20 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #D50000 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative max-w-screen-xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold mb-5">
              <Gift className="h-3.5 w-3.5" /> Get 10% Off Your First Order
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              Stay in the Fast Lane
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              Join 50,000+ car enthusiasts. Get exclusive deals, new product alerts,
              installation tips, and flash sale notifications delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors text-sm shrink-0 shadow-lg shadow-primary/25 disabled:opacity-60"
              >
                {loading ? "..." : "Subscribe"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-3">No spam. Unsubscribe anytime.</p>

            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: Gift, text: "Exclusive deals" },
                { icon: Bell, text: "Flash sale alerts" },
                { icon: Mail, text: "Weekly tips" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Icon className="h-3.5 w-3.5 text-primary" /> {text}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
                alt="Newsletter"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
