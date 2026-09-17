"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface LoginEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface ActionEntry {
  id: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  action: string;
  entityName: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

const PAGE_SIZE = 20;

const ACTION_BADGE: Record<string, "destructive" | "warning" | "success" | "secondary"> = {
  "delete:order": "destructive",
  "delete:coupon": "destructive",
  "update:role": "warning",
  "update:order_status": "secondary",
  "confirm:payment": "success",
  "update:price": "warning",
  "create:coupon": "success",
  "update:coupon": "secondary",
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDetails(details: Record<string, unknown> | null): string {
  if (!details) return "—";
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

async function api<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

function usePagedRows<T>(rows: T[]) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => rows.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE),
    [rows, clampedPage]
  );
  return { paged, page: clampedPage, totalPages, setPage };
}

export default function AuditLogPage() {
  const { data: session, isPending } = useSession();
  const isSuperAdmin = session?.user?.role === "super_admin";

  const auditQuery = useQuery({
    queryKey: ["admin", "audit-log"],
    queryFn: () => api<{ logins: LoginEntry[]; actions: ActionEntry[] }>("/api/admin/audit-log"),
    enabled: isSuperAdmin,
  });

  const logins = auditQuery.data?.logins ?? [];
  const actions = auditQuery.data?.actions ?? [];

  const loginPager = usePagedRows(logins);
  const actionPager = usePagedRows(actions);

  if (!isPending && !isSuperAdmin) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Activity Log</h1>
        <div className="p-8 border border-border/40 bg-card flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
          Only super admins can view the activity log.
        </div>
      </div>
    );
  }

  const loginColumns = [
    { header: "When", accessor: (item: LoginEntry) => formatWhen(item.createdAt) },
    {
      header: "Who",
      accessor: (item: LoginEntry) => (
        <div>
          <span className="block">{item.name}</span>
          <span className="text-[10px] text-muted-foreground block">{item.email}</span>
        </div>
      ),
    },
    { header: "Role", accessor: (item: LoginEntry) => item.role ?? "customer" },
    { header: "IP Address", accessor: (item: LoginEntry) => item.ipAddress ?? "—" },
    {
      header: "Device",
      accessor: (item: LoginEntry) => (
        <span className="block max-w-xs truncate" title={item.userAgent ?? undefined}>
          {item.userAgent ?? "—"}
        </span>
      ),
    },
  ];

  const actionColumns = [
    { header: "When", accessor: (item: ActionEntry) => formatWhen(item.createdAt) },
    {
      header: "Who",
      accessor: (item: ActionEntry) => (
        <div>
          <span className="block">{item.name ?? "Deleted user"}</span>
          <span className="text-[10px] text-muted-foreground block">{item.email ?? "—"}</span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (item: ActionEntry) => (
        <Badge variant={ACTION_BADGE[item.action] ?? "secondary"}>{item.action.replace(":", " ")}</Badge>
      ),
    },
    {
      header: "Entity",
      accessor: (item: ActionEntry) => (
        <span>
          {item.entityName}
          {item.entityId && <span className="text-[10px] text-muted-foreground block">{item.entityId}</span>}
        </span>
      ),
    },
    {
      header: "Details",
      accessor: (item: ActionEntry) => (
        <span className="block max-w-sm truncate" title={formatDetails(item.details)}>
          {formatDetails(item.details)}
        </span>
      ),
    },
  ];

  const tabContents = [
    {
      id: "actions",
      label: "Actions",
      content: (
        <Table
          columns={actionColumns}
          data={actionPager.paged}
          loading={auditQuery.isLoading}
          currentPage={actionPager.page}
          totalPages={actionPager.totalPages}
          onPageChange={actionPager.setPage}
        />
      ),
    },
    {
      id: "logins",
      label: "Logins",
      content: (
        <Table
          columns={loginColumns}
          data={loginPager.paged}
          loading={auditQuery.isLoading}
          currentPage={loginPager.page}
          totalPages={loginPager.totalPages}
          onPageChange={loginPager.setPage}
        />
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground mb-2">Activity Log</h1>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider font-sans">
            Logins and sensitive admin actions — visible only to super admins
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Live database
        </span>
      </div>

      <Tabs tabs={tabContents} />
    </div>
  );
}
