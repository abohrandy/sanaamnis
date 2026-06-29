import React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  title = "No Items Found",
  description = "There is currently no digital inventory matching this query.",
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 bg-card/20",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 bg-muted/40 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
        <Inbox className="w-6 h-6 stroke-1" />
      </div>
      <h3 className="font-serif text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-sans mb-8">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
