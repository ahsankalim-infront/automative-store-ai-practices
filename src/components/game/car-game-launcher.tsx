"use client";

import { useState } from "react";
import { Car, X, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MiniCarGame } from "@/components/game/mini-car-game";
import { cn } from "@/lib/utils";

export function CarGameLauncher() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  const handleOpen = () => {
    setSession((n) => n + 1);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            onClick={handleOpen}
            className={cn(
              "fixed z-[55] flex items-center gap-2 rounded-full shadow-xl",
              "bg-primary text-white font-bold text-xs",
              "hover:bg-primary-dark active:scale-95 transition-colors",
              "bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-4",
              "lg:bottom-6 lg:right-6",
              "pl-3 pr-4 py-2.5",
              "ring-2 ring-white/20 ring-offset-2 ring-offset-background"
            )}
            aria-label="Play mini car game"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <Car className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </span>
            <span className="hidden xs:inline">Play</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={cn(
              "fixed z-[55] w-[min(calc(100vw-1.5rem),320px)]",
              "bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-3",
              "lg:bottom-6 lg:right-6",
              "rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            )}
            role="dialog"
            aria-label="Mini car game"
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Gamepad2 className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black leading-tight truncate">Drive Dodge</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Mini car game</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close game"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3">
              <MiniCarGame key={session} autoStart />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
