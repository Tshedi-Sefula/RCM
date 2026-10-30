import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Column<Row> = {
  header: string;
  cell: (row: Row) => ReactNode;
  // e.g. "hidden md:table-cell" to drop a column on small screens.
  className?: string;
  // Hides the header text visually (keeps it for screen readers).
  srOnlyHeader?: boolean;
};

type DataTableProps<Row> = {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  getKey: (row: Row) => string;
  // Shown instead of the table when there are no rows.
  empty: ReactNode;
};

// Consistent list styling for the admin pages. Server Component, so cell
// renderers can include Client Components such as edit and delete buttons.
export default function DataTable<Row>({ caption, columns, rows, getKey, empty }: DataTableProps<Row>) {
  if (rows.length === 0) return empty;

  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-brand-line bg-brand-cream/60 text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className={cn("px-4 py-3 first:pl-5 last:pr-5", column.className)}>
                <span className={cn(column.srOnlyHeader && "sr-only")}>{column.header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-line">
          {rows.map((row) => (
            <tr key={getKey(row)} className="align-middle transition-colors hover:bg-brand-surface">
              {columns.map((column) => (
                <td key={column.header} className={cn("px-4 py-3 first:pl-5 last:pr-5", column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DataTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white" aria-hidden>
      <div className="h-11 border-b border-brand-line bg-brand-cream/60" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-brand-line px-5 py-4 last:border-0">
          <div className="h-12 w-10 animate-pulse rounded bg-brand-cream" />
          <div className="h-4 flex-1 animate-pulse rounded bg-brand-cream" />
          <div className="hidden h-4 w-32 animate-pulse rounded bg-brand-cream sm:block" />
        </div>
      ))}
    </div>
  );
}

// Small pill used in table cells (featured, past, category…).
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        className ?? "bg-brand-cream text-brand-ink",
      )}
    >
      {children}
    </span>
  );
}
