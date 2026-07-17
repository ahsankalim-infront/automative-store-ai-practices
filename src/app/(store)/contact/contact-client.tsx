"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BrandLogo } from "@/components/brand/logo";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay, phoneTelHref, whatsappHref } from "@/lib/brand/config";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

export default function ContactPage() {
  const brand = useBrand();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill name, phone, and message");
      return;
    }
    setLoading(true);
    const res = await api.contact({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject || "General Inquiry",
      message: form.message.trim(),
    });
    if (res.success) {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      toast.error(res.error || "Failed to send message");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
        <Breadcrumb items={[{ label: "Contact" }]} className="mb-4 sm:mb-6" />

        <div className="text-center mb-8 sm:mb-10">
          <BrandLogo size="lg" className="justify-center mb-4 max-w-full mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Contact {brand.name}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Visit our Lahore office, call us directly, or send a message — we&apos;re happy to help with poshish, seat covers, and orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Our Office
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {brand.address.full}
              </p>
              <p className="text-xs text-gray-400 mt-2">{brand.address.city}, {brand.address.country}</p>
            </div>

            {brand.contacts.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{person.name}</p>
                    <p className="text-xs text-gray-400">Sales & support</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {person.phones.map((phone) => (
                    <a
                      key={phone}
                      href={phoneTelHref(phone)}
                      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      {formatPhoneDisplay(phone)}
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.a
              href={`mailto:${brand.email}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-semibold text-foreground text-sm break-all">{brand.email}</p>
              </div>
            </motion.a>

            <motion.a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-5 hover:shadow-md transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-green-700 dark:text-green-400">WhatsApp</p>
                <p className="font-semibold text-foreground text-sm">
                  Chat on {formatPhoneDisplay(brand.primaryPhone)}
                </p>
              </div>
            </motion.a>

            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-foreground">Business Hours</p>
              </div>
              <p className="text-xs text-gray-500">{brand.businessHours}</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-4 h-full">
              <h2 className="font-bold text-foreground text-lg">Send us a message</h2>
              <p className="text-sm text-gray-500 -mt-2">We usually reply within a few hours during business days.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                <Input label="Phone *" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={formatPhoneDisplay(brand.primaryPhone)} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Select subject</option>
                    {["Poshish Inquiry", "Seat Cover Order", "Custom Upholstery", "Product Question", "Order Status", "Other"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your car model, poshish requirements, or any question..."
                  rows={6}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white resize-none"
                />
              </div>
              <Button fullWidth size="lg" loading={loading} leftIcon={<Send className="h-4 w-4" />} disabled={!form.name.trim() || !form.phone.trim() || !form.message.trim()}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
