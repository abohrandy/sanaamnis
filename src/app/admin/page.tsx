"use client";

import React, { useState } from "react";
import { StatCard } from "@/components/ds/cards/stat-card";
import { BarChart, LineChart } from "@/components/ds/charts";
import { Table } from "@/components/ds/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, FileText, LayoutDashboard, Users, TrendingUp } from "lucide-react";

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
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">
          Operations Hub
        </h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Platform Overview & Real-Time Analytics
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Volume" value="₦2,318,000" change={14.8} icon={TrendingUp} />
        <StatCard title="Successful Checkout Orders" value="234" change={8.4} icon={ShoppingBag} />
        <StatCard title="Platform Custom Pages" value="12" change={0.0} icon={FileText} />
        <StatCard title="Active Customers" value="1,849" change={22.1} icon={Users} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
            Revenue Performance (Monthly)
          </h3>
          <BarChart data={SALES_TREND} height={200} />
        </div>
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
            Platform Traffic Metrics
          </h3>
          <LineChart data={SALES_TREND} height={200} />
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
          Recent Orders Activity
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
