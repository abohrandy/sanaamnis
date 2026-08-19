"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  /** Renders skeleton rows instead of `data` — for the gap between mount and the first query response. */
  loading?: boolean;
  /** Row count for the skeleton while loading. */
  loadingRows?: number;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Row selection — all four required together to turn on the checkbox column.
  getRowId?: (item: T) => string;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: (ids: string[]) => void;
}

export function Table<T>({
  columns,
  data,
  className,
  loading = false,
  loadingRows = 5,
  currentPage,
  totalPages,
  onPageChange,
  getRowId,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: TableProps<T>) {
  const selectable = !!(getRowId && selectedIds && onToggleRow && onToggleAll);
  const rowIds = selectable ? data.map((item) => getRowId!(item)) : [];
  const allSelected = selectable && rowIds.length > 0 && rowIds.every((id) => selectedIds!.has(id));

  return (
    <div className={cn("w-full bg-card border border-border/40 flex flex-col justify-between shadow-xs", className)}>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20">
              {selectable && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleAll!(rowIds)}
                    aria-label="Select all rows"
                    className="cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "p-4 text-[9px] uppercase tracking-widest text-muted-foreground font-bold font-sans",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 text-xs font-sans text-foreground">
            {loading ? (
              Array.from({ length: loadingRows }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {selectable && <td className="p-4" />}
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="p-4">
                      <div className="h-3.5 rounded-sm bg-muted/30 animate-pulse" style={{ width: `${55 + ((rowIdx + colIdx) % 3) * 15}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => {
                const rowId = selectable ? rowIds[rowIdx] : undefined;
                const isSelected = rowId !== undefined && selectedIds!.has(rowId);

                return (
                  <tr key={rowIdx} className={cn("hover:bg-muted/10 transition-colors", isSelected && "bg-primary/5")}>
                    {selectable && (
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleRow!(rowId!)}
                          aria-label="Select row"
                          className="cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, colIdx) => {
                      const cellContent =
                        typeof col.accessor === "function"
                          ? col.accessor(item)
                          : (item[col.accessor] as React.ReactNode);

                      return (
                        <td key={colIdx} className={cn("p-4 font-medium", col.className)}>
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {currentPage !== undefined && totalPages !== undefined && onPageChange && (
        <div className="p-4 border-t border-border/40 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 border border-border disabled:opacity-30 disabled:pointer-events-none hover:bg-muted/30 transition-colors rounded-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 border border-border disabled:opacity-30 disabled:pointer-events-none hover:bg-muted/30 transition-colors rounded-none"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
