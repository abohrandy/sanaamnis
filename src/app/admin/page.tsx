"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StatCard } from "@/components/ds/cards/stat-card";
import { BarChart } from "@/components/ds/charts";
import { Table } from "@/components/ds/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Mail, TrendingUp, ShieldCheck, AlertTriangle, X } from "lucide-react";

interface DashboardData {
  grossRevenue: number;
  paidOrders: number;
  pendingOrders: number;
  totalOrders: number;
  activeSubscribers: number;
  monthlyRevenue: Array<{ label: string; value: number }>;
  recentOrders: Array<{ id: string; orderNumber: string; customer: string; total: number; status: string }>;
}

interface EmailFailure {
  id: string;
  to: string;
  subject: string;
  error: string;
  createdAt: string;
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "primary" | "destructive" | "secondary"> = {
  paid: "success",
  shipped: "primary",
  delivered: "success",
  pending: "warning",
  payment_failed: "destructive",
  cancelled: "secondary",
};

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async (): Promise<DashboardData> => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Could not load dashboard data.");
      return res.json();
    },
  });

  // Surfaces failed/undeliverable order emails (see src/lib/resend.ts) so a
  // rejected or misconfigured Resend send doesn't go unnoticed in server logs.
  const { data: emailFailureData } = useQuery({
    queryKey: ["admin", "email-failures"],
    queryFn: async (): Promise<{ failures: EmailFailure[] }> => {
      const res = await fetch("/api/admin/email-failures");
      if (!res.ok) throw new Error("Could not load email failures.");
      return res.json();
    },
    refetchInterval: 60_000,
  });
  const emailFailures = emailFailureData?.failures ?? [];

  async function dismissEmailFailure(id: string) {
    await fetch("/api/admin/email-failures", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    queryClient.invalidateQueries({ queryKey: ["admin", "email-failures"] });
  }

  const columns = [
    { header: "Order", accessor: "orderNumber" as const },
    { header: "Customer", accessor: "customer" as const },
    { header: "Amount", accessor: (item: DashboardData["recentOrders"][0]) => `₦${item.total.toLocaleString()}` },
    {
      header: "Status",
      accessor: (item: DashboardData["recentOrders"][0]) => (
        <Badge variant={STATUS_VARIANT[item.status] ?? "secondary"}>{item.status.replace("_", " ")}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <Badge variant="gold">DASHBOARD</Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground mt-1">
            Overview
          </h1>
          <p className="text-xs text-muted-foreground font-sans">Real order and revenue data, refreshed on load.</p>
        </div>
        <div className="px-4 py-2 rounded-[0.5rem] bg-secondary border border-border text-xs text-[#1C3322] font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Live database
        </div>
      </div>

      {emailFailures.length > 0 && (
        <div className="p-5 rounded-[1.25rem] bg-destructive/10 border border-destructive/30 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            {emailFailures.length} order email{emailFailures.length > 1 ? "s" : ""} failed to send
          </div>
          <ul className="space-y-2">
            {emailFailures.slice(0, 5).map((f) => (
              <li
                key={f.id}
                className="flex items-start justify-between gap-4 text-xs bg-card rounded-[0.75rem] border border-border p-3"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">{f.subject} → {f.to}</p>
                  <p className="text-muted-foreground">{f.error}</p>
                  <p className="text-muted-foreground">{new Date(f.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => dismissEmailFailure(f.id)}
                  className="shrink-0 p-1 rounded-full hover:bg-secondary text-muted-foreground"
                  aria-label="Dismiss"
                  title="Mark as reviewed"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Paid Revenue" value={isLoading ? "…" : `₦${(data?.grossRevenue ?? 0).toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Paid Orders" value={isLoading ? "…" : data?.paidOrders ?? 0} icon={ShoppingBag} />
        <StatCard title="Pending Orders" value={isLoading ? "…" : data?.pendingOrders ?? 0} icon={Clock} />
        <StatCard title="Newsletter Subscribers" value={isLoading ? "…" : data?.activeSubscribers ?? 0} icon={Mail} />
      </div>

      <div className="p-6 rounded-[1.25rem] bg-card border border-border space-y-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#1C3322] font-bold">
          Monthly Revenue — Paid Orders (₦)
        </h3>
        {data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
          <BarChart data={data.monthlyRevenue} height={200} />
        ) : (
          <p className="text-xs text-muted-foreground py-10 text-center">
            No paid orders in the last 6 months yet.
          </p>
        )}
      </div>

      <div className="p-6 rounded-[1.25rem] bg-card border border-border space-y-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#1C3322] font-bold">Recent Orders</h3>
        <Table columns={columns} data={data?.recentOrders ?? []} loading={isLoading} />
      </div>
    </div>
  );
}
