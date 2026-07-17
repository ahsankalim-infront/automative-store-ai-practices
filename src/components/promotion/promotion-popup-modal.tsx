"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Copy, Sparkles, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PromotionPopup } from "@/types";
import toast from "react-hot-toast";

const STORAGE_KEY = "sph-promotion-popup-dismissed";

interface StoredDismiss {
  id: string;
  until: number;
}

function readDismiss(): StoredDismiss | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDismiss;
    if (!parsed?.id || !parsed?.until) return null;
    if (Date.now() > parsed.until) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveDismiss(popup: PromotionPopup) {
  const days = Math.max(1, popup.dismissDays || 1);
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: popup.id, until }));
}

interface PromotionPopupModalProps {
  popup: PromotionPopup;
}

export function PromotionPopupModal({ popup }: PromotionPopupModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = readDismiss();
    if (dismissed?.id === popup.id) return;

    const delay = Math.max(0, popup.showDelayMs ?? 1200);
    const timer = window.setTimeout(() => setOpen(true), delay);
    return () => window.clearTimeout(timer);
  }, [popup.id, popup.showDelayMs]);

  const handleDismiss = useCallback(() => {
    saveDismiss(popup);
    setOpen(false);
  }, [popup]);

  const copyCoupon = useCallback(() => {
    if (!popup.couponCode) return;
    navigator.clipboard.writeText(popup.couponCode).then(
      () => toast.success("Coupon copied!"),
      () => toast.error("Could not copy coupon")
    );
  }, [popup.couponCode]);

  const accent = popup.accentColor || "#D50000";
  const desktopImage = popup.image;
  const mobileImage = popup.mobileImage || popup.image;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleDismiss()}>
      <DialogContent
        showMobileHandle={false}
        className={cn(
          "gap-0 overflow-hidden border-0 p-0 sm:border sm:max-w-xl lg:max-w-2xl",
          /* Close button: visible on image / dark areas */
          "[&>button]:top-3 [&>button]:right-3 sm:[&>button]:top-3.5 sm:[&>button]:right-3.5",
          "[&>button]:flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center",
          "[&>button]:rounded-full [&>button]:bg-black/50 [&>button]:text-white",
          "[&>button]:backdrop-blur-sm [&>button]:hover:bg-black/65 [&>button]:hover:text-white"
        )}
      >
        <div className="flex max-h-[min(88dvh,560px)] flex-col overflow-hidden sm:flex-row">
          {/* Image panel */}
          <div className="relative h-40 w-full shrink-0 xs:h-44 sm:h-auto sm:min-h-[300px] sm:w-[44%]">
            {desktopImage ? (
              <>
                <Image
                  src={mobileImage}
                  alt=""
                  fill
                  aria-hidden
                  className="object-cover object-center sm:hidden"
                  sizes="100vw"
                  priority
                />
                <Image
                  src={desktopImage}
                  alt={popup.title}
                  fill
                  className="hidden object-cover object-center sm:block"
                  sizes="(max-width: 1024px) 384px, 420px"
                  priority
                />
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(145deg, ${accent} 0%, #111 100%)` }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 sm:from-black/70 sm:via-black/20 sm:to-transparent" />

            {popup.badgeText && (
              <Badge
                className="absolute left-3 top-3 max-w-[calc(100%-3.5rem)] truncate border-0 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg sm:left-4 sm:top-4"
                style={{ backgroundColor: accent }}
              >
                {popup.badgeText}
              </Badge>
            )}

            {/* Mobile: title overlaid on image to save vertical space */}
            <div className="absolute inset-x-0 bottom-0 p-4 pt-10 sm:hidden">
              <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                <Sparkles className="h-3 w-3 shrink-0" style={{ color: accent }} />
                Special offer
              </p>
              <h2 className="text-lg font-black leading-tight text-white">{popup.title}</h2>
              {popup.subtitle && (
                <p className="mt-0.5 line-clamp-2 text-xs font-medium text-white/85">
                  {popup.subtitle}
                </p>
              )}
            </div>

            <div
              className="absolute inset-x-0 bottom-0 h-0.5 sm:hidden"
              style={{ backgroundColor: accent }}
              aria-hidden
            />
          </div>

          {/* Content panel */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <DialogHeader className="hidden border-b border-border/60 pb-3 pt-5 sm:flex sm:px-5">
              <DialogTitle className="text-xl font-black leading-snug">{popup.title}</DialogTitle>
              {popup.subtitle && (
                <p className="text-sm font-medium text-muted-foreground">{popup.subtitle}</p>
              )}
            </DialogHeader>

            {/* Screen-reader title on mobile (visual title is on image) */}
            <DialogTitle className="sr-only sm:hidden">{popup.title}</DialogTitle>

            <DialogBody className="flex-1 px-4 pb-3 pt-3 sm:px-5 sm:pt-4">
              {popup.description && (
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4 sm:line-clamp-none">
                  {popup.description}
                </p>
              )}

              {popup.couponCode && (
                <button
                  type="button"
                  onClick={copyCoupon}
                  className="group relative mt-3 w-full overflow-hidden rounded-2xl border border-dashed text-left transition-colors hover:border-primary/50 sm:mt-4"
                  style={{ borderColor: `${accent}44` }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{ backgroundColor: accent }}
                    aria-hidden
                  />
                  <div
                    className="relative flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    style={{ backgroundColor: `${accent}0a` }}
                  >
                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                      <Tag className="h-4 w-4 shrink-0" style={{ color: accent }} />
                      Tap to copy at checkout
                    </span>
                    <span
                      className="flex items-center gap-2 self-start font-black tracking-[0.18em] sm:self-auto sm:text-lg"
                      style={{ color: accent }}
                    >
                      {popup.couponCode}
                      <Copy className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
                    </span>
                  </div>
                </button>
              )}
            </DialogBody>

            <DialogFooter
              className={cn(
                "flex-col-reverse gap-2.5 border-t border-border/60 bg-muted/20 px-4 py-4 sm:bg-card sm:px-5",
                "pb-[max(1rem,env(safe-area-inset-bottom))]"
              )}
            >
              <Button
                asChild
                size="lg"
                fullWidth
                className="min-h-11 font-bold text-white shadow-md hover:opacity-95"
                style={{ backgroundColor: accent }}
              >
                <Link href={popup.ctaHref} onClick={handleDismiss}>
                  {popup.ctaLabel}
                </Link>
              </Button>
              {popup.secondaryHref ? (
                <Button variant="ghost" asChild size="lg" fullWidth className="min-h-10 text-muted-foreground">
                  <Link href={popup.secondaryHref} onClick={handleDismiss}>
                    {popup.secondaryLabel || "Learn more"}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  className="min-h-10 text-muted-foreground"
                  onClick={handleDismiss}
                >
                  {popup.secondaryLabel || "Maybe later"}
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
