"use client";
import { useState } from "react";
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

export function MegaMenu({ categories = [] }: { categories?: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) =>
        item.hasMega ? (
          <div key={item.label} className="relative group">
            <button
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                "text-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {item.label}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
            </button>

            <div
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 w-[800px] mt-1 bg-card rounded-2xl shadow-2xl border border-border z-50",
                "transition-all duration-200 origin-top",
                open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
              )}
            >
              <div className="p-6">
                <div className="grid grid-cols-4 gap-6">
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
                <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-3">
                  {categories.slice(0, 3).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 transition-colors group/cat"
                    >
                      <span className="text-xs font-semibold text-foreground group-hover/cat:text-primary transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{cat.productCount}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className="px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
