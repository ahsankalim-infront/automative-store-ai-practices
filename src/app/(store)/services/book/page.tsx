"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Car, CheckCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useServices, useStores } from "@/hooks/use-api-data";
import { api } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

export default function BookServicePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: services = [] } = useServices();
  const { data: stores = [] } = useStores();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", vehicle: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const service = services.find(s => s.id === selectedService);
  const branch = stores.find(s => s.id === selectedBranch);

  const steps = [
    { num: 1, label: "Service" },
    { num: 2, label: "Branch & Time" },
    { num: 3, label: "Your Details" },
  ];

  const handleBook = async () => {
    if (!user) {
      toast.error("Please sign in to book a service");
      router.push("/auth/login");
      return;
    }
    if (!service || !branch) return;
    setLoading(true);
    const res = await api.createBooking({
      serviceId: service.id,
      serviceName: service.name,
      userName: form.name,
      userPhone: form.phone,
      branchId: branch.id,
      branchName: branch.name,
      date: selectedDate,
      timeSlot: selectedTime,
      vehicleInfo: form.vehicle,
      notes: form.notes,
      price: service.priceFrom,
    });
    if (res.success) {
      toast.success("Service booked! We'll confirm via SMS.");
      router.push("/dashboard/bookings");
    } else {
      toast.error(res.error || "Booking failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: "Book Service" }]} className="mb-6" />
        <h1 className="text-3xl font-black text-foreground mb-2">Book a Service</h1>
        <p className="text-gray-500 mb-8">Fill out the form below and our team will confirm your appointment.</p>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > s.num ? "bg-green-500 text-white" : step === s.num ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                {step > s.num ? <CheckCircle className="h-4 w-4" /> : s.num}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === s.num ? "text-primary" : "text-gray-400"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`h-0.5 w-10 mx-2 ${step > s.num ? "bg-green-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-bold text-foreground mb-5 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Select Service
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map(svc => (
                    <label key={svc.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedService === svc.id ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"}`}>
                      <input type="radio" name="service" value={svc.id} checked={selectedService === svc.id} onChange={() => setSelectedService(svc.id)} className="hidden" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{svc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">From Rs.{svc.priceFrom.toLocaleString()}</p>
                      </div>
                      {selectedService === svc.id && <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                    </label>
                  ))}
                </div>
                <Button fullWidth size="lg" className="mt-5" disabled={!selectedService} onClick={() => setStep(2)}>
                  Continue to Branch & Time
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Branch & Date
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Branch</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto scrollbar-hide">
                    {stores.map(store => (
                      <label key={store.id} className={`flex items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${selectedBranch === store.id ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"}`}>
                        <input type="radio" name="branch" value={store.id} checked={selectedBranch === store.id} onChange={() => setSelectedBranch(store.id)} className="hidden" />
                        <div>
                          <p className="font-semibold text-foreground text-xs">{store.name}</p>
                          <p className="text-xs text-gray-400">{store.city}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                    <input type="date" value={selectedDate} min={new Date().toISOString().split("T")[0]}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Slot</label>
                    <div className="grid grid-cols-3 gap-1">
                      {timeSlots.map(t => (
                        <button key={t} onClick={() => setSelectedTime(t)}
                          className={`py-1.5 text-xs rounded-lg border font-medium transition-all ${selectedTime === t ? "border-primary bg-primary text-white" : "border-border text-gray-600 hover:border-gray-300"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button fullWidth disabled={!selectedBranch || !selectedDate || !selectedTime} onClick={() => setStep(3)}>Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" /> Your Details
                </h2>
                <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ahmed Khan" />
                <Input label="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0300-1234567" type="tel" />
                <Input label="Vehicle (Make, Model, Year)" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} placeholder="Toyota Corolla 2022" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Additional Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any specific requirements or questions..."
                    rows={3} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white resize-none" />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button fullWidth loading={loading} disabled={!form.name || !form.phone} onClick={handleBook}>
                    Confirm Booking
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-32">
              <h3 className="font-bold text-foreground mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <span>{service?.name || "Select a service"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{branch?.name || "Select a branch"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>{selectedDate || "Select a date"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>{selectedTime || "Select a time"}</span>
                </div>
              </div>
              {service && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="text-xl font-black text-primary">Rs.{service.priceFrom.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
