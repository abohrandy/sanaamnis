"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/ds/cards/stat-card";
import { BarChart } from "@/components/ds/charts";
import { Table } from "@/components/ds/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Mail, TrendingUp, ShieldCheck } from "lucide-react";

interface DashboardData {
  grossRevenue: number;
  paidOrders: number;
  pendingOrders: number;
  totalOrders: number;
  activeSubscribers: number;
  monthlyRevenue: Array<{ label: string; value: number }>;
  recentOrders: Array<{ id: string; orderNumber: string; customer: string; total: number; status: string }>;
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
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async (): Promise<DashboardData> => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Could not load dashboard data.");
      return res.json();
    },
  });

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
