"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { Trash2, ShieldCheck } from "lucide-react";

interface OrderItem {
  quantity: number;
  priceAtPurchase: number;
  productTitle: string;
  productSlug: string | null;
  variantName: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  role: string | null;
  createdAt: string;
}

interface OrderActivity {
  email: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

const naira = (n: number) => `₦${n.toLocaleString()}`;

const STATUS_VARIANT: Record<string, "success" | "warning" | "primary" | "destructive" | "secondary"> = {
  paid: "success",
  shipped: "primary",
  delivered: "success",
  pending: "warning",
  payment_failed: "destructive",
  cancelled: "secondary",
};

const STATUS_OPTIONS = ["pending", "paid", "payment_failed", "shipped", "delivered", "cancelled"].map((s) => ({
  value: s,
  label: s.replace("_", " "),
}));

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

export default function AdminOperationsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => api<{ orders: AdminOrder[] }>("/api/admin/orders"),
  });
  const customersQuery = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: () => api<{ accounts: RegisteredAccount[]; orderActivity: OrderActivity[] }>("/api/admin/customers"),
  });
  const subscribersQuery = useQuery({
    queryKey: ["admin", "newsletter"],
    queryFn: () => api<{ subscribers: Subscriber[] }>("/api/admin/newsletter"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: Error) => toast.error("Could not update order", err.message),
  });

  const removeSubscriber = useMutation({
    mutationFn: (id: string) => api(`/api/admin/newsletter/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Subscriber removed");
      queryClient.invalidateQueries({ queryKey: ["admin", "newsletter"] });
    },
    onError: (err: Error) => toast.error("Could not remove subscriber", err.message),
  });

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders = ordersQuery.data?.orders ?? [];
  const accounts = customersQuery.data?.accounts ?? [];
  const activity = customersQuery.data?.orderActivity ?? [];
  const subscribers = subscribersQuery.data?.subscribers ?? [];

  const orderColumns = [
    {
      header: "Order",
      accessor: (item: AdminOrder) => (
        <button onClick={() => setExpandedOrder(expandedOrder === item.id ? null : item.id)} className="text-left cursor-pointer">
          <span className="font-serif font-bold text-sm text-white block">{item.orderNumber}</span>
          <span className="text-[10px] text-neutral-400">{new Date(item.createdAt).toLocaleDateString()}</span>
        </button>
      ),
    },
    {
      header: "Customer",
      accessor: (item: AdminOrder) => (
        <div>
          <span className="block">{item.customerName || "Guest"}</span>
          <span className="text-[10px] text-neutral-400">{item.customerEmail || "—"}</span>
        </div>
      ),
    },
    { header: "Total", accessor: (item: AdminOrder) => naira(item.totalAmount) },
    {
      header: "Status",
      accessor: (item: AdminOrder) => (
        <Select
          value={item.status}
          onChange={(e) => updateStatus.mutate({ id: item.id, status: e.target.value })}
          options={STATUS_OPTIONS}
          className="!py-2 !text-[10px] w-36"
        />
      ),
    },
  ];

  const accountColumns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    { header: "Role", accessor: (item: RegisteredAccount) => <Badge variant="secondary">{item.role || "customer"}</Badge> },
    { header: "Joined", accessor: (item: RegisteredAccount) => new Date(item.createdAt).toLocaleDateString() },
  ];

  const activityColumns = [
    { header: "Email", accessor: "email" as const },
    { header: "Name on orders", accessor: "name" as const },
    { header: "Orders", accessor: "orderCount" as const },
    { header: "Total spent", accessor: (item: OrderActivity) => naira(item.totalSpent) },
    { header: "Last order", accessor: (item: OrderActivity) => new Date(item.lastOrderAt).toLocaleDateString() },
  ];

  const subscriberColumns = [
    { header: "Email", accessor: "email" as const },
    { header: "Subscribed", accessor: (item: Subscriber) => new Date(item.createdAt).toLocaleDateString() },
    { header: "Status", accessor: (item: Subscriber) => <Badge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "active" : "unsubscribed"}</Badge> },
    {
      header: "Actions",
      accessor: (item: Subscriber) => (
        <Button variant="ghost" size="sm" onClick={() => removeSubscriber.mutate(item.id)} className="p-2 text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const expanded = orders.find((o) => o.id === expandedOrder);

  const tabContents = [
    {
      id: "orders",
      label: "Orders",
      content: (
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
            Orders ({orders.length})
          </h3>
          <Table columns={orderColumns} data={orders} loading={ordersQuery.isLoading} />
          {expanded && (
            <div className="p-5 bg-neutral-900 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{expanded.orderNumber} — items</h4>
              {expanded.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-neutral-300 py-1.5 border-b border-neutral-800 last:border-0">
                  <span>{item.productTitle} — {item.variantName} × {item.quantity}</span>
                  <span className="font-serif text-white">{naira(item.priceAtPurchase * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "customers",
      label: "Customers",
      content: (
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
              Order activity ({activity.length}) — grouped by email, checkout doesn&apos;t require an account
            </h3>
            <Table columns={activityColumns} data={activity} loading={customersQuery.isLoading} />
          </div>
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
              Registered accounts ({accounts.length})
            </h3>
            <Table columns={accountColumns} data={accounts} loading={customersQuery.isLoading} />
          </div>
        </div>
      ),
    },
    {
      id: "newsletter",
      label: "Newsletter",
      content: (
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
            Subscribers ({subscribers.length})
          </h3>
          <Table columns={subscriberColumns} data={subscribers} loading={subscribersQuery.isLoading} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">Operations</h1>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
            Real orders, customers and subscribers
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
