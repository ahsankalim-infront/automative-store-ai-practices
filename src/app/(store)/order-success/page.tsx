"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, Truck, ArrowRight, FileDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/logo";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay, phoneTelHref } from "@/lib/brand/config";
import { downloadOrderSummaryPdf } from "@/lib/orders/download-order-summary-pdf";
import toast from "react-hot-toast";

function OrderSuccessContent() {
  const brand = useBrand();
  const params = useSearchParams();
  const orderNumber = params.get("order") || `${brand.orderPrefix}-2026-000000`;
  const orderId = params.get("id");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  const handleDownloadPdf = useCallback(async (silent = false) => {
    if (!orderId) {
      if (!silent) toast.error("Order ID missing — open from My Orders to download PDF");
      return;
    }
    setPdfLoading(true);
    try {
      await downloadOrderSummaryPdf(orderId, orderNumber);
      setPdfReady(true);
      if (!silent) toast.success("Order summary PDF downloaded");
    } catch {
      if (!silent) toast.error("Could not download PDF. Try again from My Orders.");
    } finally {
      setPdfLoading(false);
    }
  }, [orderId, orderNumber]);

  useEffect(() => {
    if (!orderId) return;
    const timer = setTimeout(async () => {
      try {
        await downloadOrderSummaryPdf(orderId, orderNumber);
        setPdfReady(true);
        toast.success("Order summary PDF saved (includes terms & policies)", { duration: 4000 });
      } catch {
        // Auto-download is best-effort; user can tap the button
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [orderId, orderNumber]);

  return (
    <div className="max-w-lg w-full text-center">
      <BrandLogo size="md" className="justify-center mb-6" />
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}
        className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="text-3xl font-black text-foreground mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">Thank you for your order. We&apos;ll process it right away.</p>

        <div className="bg-card rounded-2xl border border-border p-5 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Order Number</span>
            <span className="font-bold text-foreground">{orderNumber}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-bold text-foreground">2-3 Business Days</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-bold text-green-600 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Confirmed
            </span>
          </div>
        </div>

        {/* PDF download */}
        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5 mb-6 text-left">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileDown className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm">Order Summary PDF</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Includes item details, totals, terms & conditions, shipping, returns, warranty and privacy policies.
              </p>
              <Button
                type="button"
                size="sm"
                className="mt-3"
                variant={pdfReady ? "outline" : "primary"}
                loading={pdfLoading}
                leftIcon={pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                onClick={() => handleDownloadPdf(false)}
                disabled={!orderId}
              >
                {pdfReady ? "Download Again" : "Download Order Summary (PDF)"}
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-bold text-foreground text-sm mb-4 text-left">Order Timeline</h3>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, label: "Order Confirmed", done: true },
              { icon: Package, label: "Processing", done: false },
              { icon: Truck, label: "Shipped", done: false },
              { icon: CheckCircle, label: "Delivered", done: false },
            ].map((step, i) => {
              const StepIcon = step.icon;
              return (
              <div key={step.label} className="flex items-center gap-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                  <StepIcon className="h-4 w-4" />
                </div>
                <span className={`text-sm ${step.done ? "font-semibold text-foreground" : "text-gray-400"}`}>{step.label}</span>
                {i === 0 && <span className="ml-auto text-xs text-green-600 font-medium">Just now</span>}
              </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild fullWidth size="lg">
            <Link href="/dashboard/orders"><Package className="h-4 w-4 mr-2" />Track Order</Link>
          </Button>
          <Button asChild fullWidth size="lg" variant="outline">
            <Link href="/products"><ArrowRight className="h-4 w-4 mr-2" />Continue Shopping</Link>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-xl text-sm text-gray-500">
          <p>📧 Order confirmation email includes the PDF attachment.</p>
          <p className="mt-1">📱 You&apos;ll receive SMS/WhatsApp updates on your order.</p>
          <p className="mt-1">📞 Questions? Call <a href={phoneTelHref(brand.primaryPhone)} className="text-primary font-semibold">{formatPhoneDisplay(brand.primaryPhone)}</a></p>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4">
      <Suspense fallback={
        <div className="max-w-lg w-full text-center">
          <div className="h-24 w-24 rounded-full bg-gray-100 animate-pulse mx-auto mb-6" />
          <div className="h-8 bg-gray-100 rounded animate-pulse mb-4 mx-auto w-48" />
          <div className="h-4 bg-gray-100 rounded animate-pulse mx-auto w-64" />
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
