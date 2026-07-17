"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND_LOGO_SRC } from "@/lib/brand/assets";
import { useBrand } from "@/lib/brand/brand-context";

interface LogoMarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  sm: { box: "h-8 w-8", px: 32 },
  md: { box: "h-9 w-9", px: 36 },
  lg: { box: "h-11 w-11", px: 44 },
  xl: { box: "h-14 w-14", px: 56 },
};

/** SPH monogram — official Shahzad Poshish House mark (transparent background) */
export function LogoMark({ size = "md", className, priority = false }: LogoMarkProps) {
  const s = sizeMap[size];
  return (
    <div className={cn(s.box, "relative shrink-0", className)} aria-hidden>
      <Image
        src={BRAND_LOGO_SRC}
        alt=""
        fill
        className="object-contain object-center"
        sizes={`${s.px}px`}
        priority={priority}
      />
    </div>
  );
}

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  textClassName?: string;
  priority?: boolean;
}

function renderStoreName(name: string) {
  const marker = "Poshish";
  const idx = name.indexOf(marker);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span className="text-primary">{marker}</span>
      {name.slice(idx + marker.length)}
    </>
  );
}

export function BrandLogo({
  size = "md",
  showText = true,
  className,
  textClassName,
  priority = false,
}: BrandLogoProps) {
  const brand = useBrand();

  return (
    <div className={cn("flex items-center gap-2.5 min-w-0", className)}>
      <LogoMark size={size} priority={priority} />
      {showText && (
        <div className={cn("min-w-0", textClassName)}>
          <p className="text-sm sm:text-base font-black text-foreground leading-tight truncate">
            {renderStoreName(brand.name)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 leading-none truncate">
            {brand.tagline}
          </p>
        </div>
      )}
    </div>
  );
}
