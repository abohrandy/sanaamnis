"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  height?: number;
  className?: string;
  color?: string;
}

export function BarChart({ data, height = 200, className, color = "var(--color-primary)" }: ChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("w-full bg-card border border-border/40 p-6 flex flex-col justify-between", className)}>
      <div className="flex items-end gap-3 justify-between w-full" style={{ height: `${height}px` }}>
        {data.map((d, idx) => {
          const percentageHeight = (d.value / maxVal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
              {/* Tooltip on hover */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-none absolute mb-2 translate-y-[-24px] pointer-events-none">
                {d.value}
              </span>
              <div
                className="w-full transition-all duration-500 origin-bottom"
                style={{
                  height: `${percentageHeight}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-4 text-[9px] uppercase tracking-widest text-muted-foreground font-semibold font-sans">
        {data.map((d, idx) => (
          <span key={idx} className="flex-1 text-center truncate">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data, height = 200, className, color = "var(--color-primary)" }: ChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const width = 500;
  const padding = 20;

  // Generate SVG coordinate points
  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathDefinition = `M ${points.join(" L ")}`;

  return (
    <div className={cn("w-full bg-card border border-border/40 p-6 flex flex-col justify-between", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Sparkline Path */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          points={points.join(" ")}
          className="transition-all duration-1000"
        />
        {/* Data point circles */}
        {data.map((d, idx) => {
          const [cx, cy] = points[idx].split(",");
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r="4"
              className="fill-card stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all duration-150"
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </circle>
          );
        })}
      </svg>
      {/* Labels */}
      <div className="flex justify-between mt-4 text-[9px] uppercase tracking-widest text-muted-foreground font-semibold font-sans">
        {data.map((d, idx) => (
          <span key={idx} className="flex-1 text-center">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
