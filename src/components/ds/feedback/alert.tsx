import React from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertOctagon,
  };

  const Icon = icons[variant];

  const variants = {
    info: "bg-blue-500/5 text-blue-600 border-blue-500/25",
    success: "bg-green-500/5 text-green-600 border-green-500/25",
    warning: "bg-amber-500/5 text-amber-600 border-amber-500/25",
    error: "bg-destructive/5 text-destructive border-destructive/25",
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-5 border text-xs leading-relaxed font-sans shadow-xs rounded-none",
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <div className="space-y-1.5">
        {title && (
          <h4 className="font-bold uppercase tracking-wider text-[10px] text-foreground">
            {title}
          </h4>
        )}
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
