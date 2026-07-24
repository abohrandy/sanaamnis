"use client";

import React, { useState } from "react";
import { StatCard } from "@/components/ds/cards/stat-card";
import { BarChart, LineChart } from "@/components/ds/charts";
import { Table } from "@/components/ds/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, FileText, Users, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";

const RECENT_ORDERS = [
  { id: "1", orderNumber: "SA-982312", customer: "John Doe", total: "₦185,000", status: "paid" },
  { id: "2", orderNumber: "SA-102943", customer: "Jane Smith", total: "₦95,000", status: "pending" },
  { id: "3", orderNumber: "SA-549210", customer: "Alex Johnson", total: "₦68,000", status: "shipped" },
];

const SALES_TREND = [
  { label: "Jan", value: 340000 },
  { label: "Feb", value: 450000 },
  { label: "Mar", value: 680000 },
  { label: "Apr", value: 590000 },
  { label: "May", value: 890000 },
  { label: "Jun", value: 1200000 },
];

export default function AdminDashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    { header: "Order ID", accessor: "orderNumber" as const },
    { header: "Customer", accessor: "customer" as const },
    { header: "Amount", accessor: "total" as const },
    {
      header: "Status",
      accessor: (item: typeof RECENT_ORDERS[0]) => {
        const variants: Record<string, "success" | "warning" | "primary"> = {
          paid: "success",
          pending: "warning",
          shipped: "primary",
        };
        return <Badge variant={variants[item.status]}>{item.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#242A26]">
        <div>
          <Badge variant="gold">SANCTUARY CONTROL HUB</Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#FAF8F5] mt-1">
            Operations & Performance
          </h1>
          <p className="text-xs text-[#FAF8F5]/60 font-sans">
            Real-time revenue metrics, Paystack transaction stream, and content management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[0.5rem] bg-[#1C3322] border border-[#242A26] text-xs text-[#C9A227] font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Live Gateway Sync
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Volume" value="₦2,318,000" change={14.8} icon={TrendingUp} />
        <StatCard title="Successful Orders" value="234" change={8.4} icon={ShoppingBag} />
        <StatCard title="Platform Pages" value="12" change={0.0} icon={FileText} />
        <StatCard title="Active Patrons" value="1,849" change={22.1} icon={Users} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-[1.25rem] bg-[#161A17] border border-[#242A26] space-y-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-bold">
            Monthly Revenue Performance (NGN)
          </h3>
          <BarChart data={SALES_TREND} height={200} />
        </div>

        <div className="p-6 rounded-[1.25rem] bg-[#161A17] border border-[#242A26] space-y-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-bold">
            Platform Traffic & Collector Growth
          </h3>
          <LineChart data={SALES_TREND} height={200} />
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="p-6 rounded-[1.25rem] bg-[#161A17] border border-[#242A26] space-y-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-bold">
          Recent Transaction Activity
        </h3>
        <Table
          columns={columns}
          data={RECENT_ORDERS}
          currentPage={currentPage}
          totalPages={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

