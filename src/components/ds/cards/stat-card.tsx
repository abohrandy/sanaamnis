import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number; // e.g. 12.5 or -3.2
  timeframe?: string;
  icon?: LucideIcon;
}

export function StatCard({
  className,
  title,
  value,
  change,
  timeframe = "vs last month",
  icon: Icon,
  ...props
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "bg-card border border-border/40 p-6 flex flex-col justify-between shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold font-sans">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-3xl font-bold text-foreground">
          {value}
        </h3>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span
              className={cn(
                "inline-flex items-center gap-0.5",
                isPositive ? "text-green-600" : "text-destructive"
              )}
            >
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(change)}%
            </span>
            <span className="text-[10px] text-muted-foreground font-medium font-sans">
              {timeframe}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
