"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", hasMega: true },
  { label: "PPF", href: "/products?category=paint-protection-film" },
  { label: "Detailing", href: "/services#detailing" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const megaColumns = [
  { title: "LED & Lights", items: ["Headlights", "Fog Lamps", "DRLs", "Strip Lights", "LED Logos", "HID Kits"] },
  { title: "Exterior", items: ["Chrome Accessories", "Window Visors", "Door Guards", "Mud Flaps", "Emblems", "Body Kits"] },
  { title: "Interior", items: ["Seat Covers", "Car Mats", "Steering Covers", "Sun Shades", "Organizers", "Armrests"] },
  { title: "Electronics", items: ["Android Panels", "Dash Cameras", "Parking Sensors", "Car Audio", "Bluetooth"] },
];

const navLinkClass =
  "px-2 xl:px-3 py-1.5 xl:py-2 text-[13px] xl:text-sm font-medium rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 whitespace-nowrap";

function MegaDropdownPanel({
  categories,
  panelStyle,
  onMouseEnter,
  onMouseLeave,
}: {
  categories: Category[];
  panelStyle: CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={panelStyle}
      className={cn(
        "bg-card rounded-2xl shadow-2xl border border-border",
        "animate-in fade-in-0 zoom-in-95 duration-150"
      )}
    >
      {/* Invisible bridge — keeps hover active across trigger → panel gap */}
      <div className="absolute -top-2 left-0 right-0 h-2" aria-hidden />
      <div className="p-4 xl:p-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
          {megaColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.items.map((sub) => (
                  <li key={sub}>
                    <Link
                      href={`/products?q=${encodeURIComponent(sub)}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors block py-0.5"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 xl:mt-5 pt-4 xl:pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-2 xl:gap-3">
          {categories.slice(0, 3).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 transition-colors group/cat"
            >
              <span className="text-xs font-semibold text-foreground group-hover/cat:text-primary transition-colors truncate">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400 ml-auto shrink-0">{cat.productCount}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function computePanelStyle(trigger: HTMLElement): CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(800, window.innerWidth - 32);
  const left = Math.max(16, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 16));

  return {
    position: "fixed",
    top: rect.bottom + 2,
    left,
    width,
    zIndex: 60,
  };
}

export function MegaMenu({ categories = [] }: { categories?: Category[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setPanelStyle(null);
    }, 150);
  }, [cancelClose]);

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    setPanelStyle(computePanelStyle(trigger));
  }, []);

  const handleOpen = useCallback(() => {
    cancelClose();
    const trigger = triggerRef.current;
    if (!trigger) return;
    setPanelStyle(computePanelStyle(trigger));
    setOpen(true);
  }, [cancelClose]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;

    const onScrollOrResize = () => updatePanelPosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  return (
    <>
      <nav className="flex flex-nowrap items-center justify-center gap-0.5 xl:gap-1 overflow-visible">
        {navItems.map((item) =>
          item.hasMega ? (
            <div key={item.label} ref={triggerRef} className="relative shrink-0">
              <button
                type="button"
                onMouseEnter={handleOpen}
                onMouseLeave={scheduleClose}
                className={cn(
                  "flex items-center gap-1 rounded-lg transition-colors duration-200",
                  navLinkClass,
                  open && "text-primary bg-primary/5"
                )}
              >
                {item.label}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
              </button>
            </div>
          ) : (
            <Link key={item.label} href={item.href} className={cn(navLinkClass, "shrink-0")}>
              {item.label}
            </Link>
          )
        )}
      </nav>

      {mounted && open && panelStyle
        ? createPortal(
            <MegaDropdownPanel
              categories={categories}
              panelStyle={panelStyle}
              onMouseEnter={handleOpen}
              onMouseLeave={scheduleClose}
            />,
            document.body
          )
        : null}
    </>
  );
}
