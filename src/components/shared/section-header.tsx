import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  centered?: boolean;
  className?: string;
  badge?: string;
  dark?: boolean;
}

export function SectionHeader({
  title, subtitle, viewAllHref, viewAllLabel = "View All",
  centered, className, badge, dark,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "flex items-end justify-between mb-8 gap-4",
      centered && "flex-col items-center text-center",
      className
    )}>
      <div className={centered ? "flex flex-col items-center" : ""}>
        {badge && (
          <span className={cn(
            "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] mb-3",
            dark ? "text-primary" : "text-primary"
          )}>
            <span className="h-px w-6 bg-primary/60" />
            {badge}
            {centered && <span className="h-px w-6 bg-primary/60" />}
          </span>
        )}
        <h2 className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight",
          dark ? "text-white" : "text-foreground"
        )}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn(
            "mt-2.5 text-sm md:text-base max-w-xl leading-relaxed",
            dark ? "text-gray-400" : "text-gray-500 dark:text-gray-400",
            centered && "mx-auto"
          )}>
            {subtitle}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 shrink-0",
            "px-4 py-2 rounded-full border border-border hover:border-primary hover:text-primary hover:gap-2.5",
            dark ? "border-white/20 text-white hover:bg-white/5" : "text-primary bg-primary/5 hover:bg-primary/10"
          )}
        >
          {viewAllLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
