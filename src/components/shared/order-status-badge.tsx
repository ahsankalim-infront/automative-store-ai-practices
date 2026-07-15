import { cn } from "@/lib/utils";
import { formatOrderStatusLabel, getOrderStatusBadgeClasses } from "@/lib/order-status";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
  uppercase?: boolean;
  children?: React.ReactNode;
}

export function OrderStatusBadge({
  status,
  className,
  uppercase = false,
  children,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        uppercase ? "uppercase" : "capitalize",
        getOrderStatusBadgeClasses(status),
        className
      )}
    >
      {children ?? formatOrderStatusLabel(status, uppercase)}
    </span>
  );
}
