import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && (
        <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <Button asChild variant="primary">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button variant="primary" onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}
