"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ds/dialog";
import { useToast } from "@/hooks/useToast";
import { useSession } from "@/lib/auth-client";
import { Trash2, ShieldCheck } from "lucide-react";

interface OrderItem {
  quantity: number;
  priceAtPurchase: number;
  productTitle: string;
  productSlug: string | null;
  variantName: string;
  bundleTitle: string | null;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentReference: string | null;
  totalAmount: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: string;
  deliveryLabel: string;
  deliveryFee: number;
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
  awaiting_confirmation: "warning",
  payment_failed: "destructive",
  cancelled: "secondary",
};

const STATUS_OPTIONS = [
  "pending",
  "awaiting_confirmation",
  "paid",
  "payment_failed",
  "shipped",
  "delivered",
  "cancelled",
].map((s) => ({
  value: s,
  label: s.replace("_", " "),
}));

// Roles a super_admin can assign, with proper labels for that management
// control — it's only ever shown to the super_admin themselves, so there's
// no reason to mask "Super Admin" there the way the read-only badge does.
const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "editor", label: "Editor" },
  { value: "content_manager", label: "Content Manager" },
  { value: "store_manager", label: "Store Manager" },
  { value: "sales", label: "Sales" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

// The passive badge everyone else with view:customers sees. super_admin reads
// as "Admin" here on purpose, so staff browsing this table can't single out
// the highest-privilege account.
function displayRoleLabel(role: string | null): string {
  if (!role || role === "customer") return "Customer";
  if (role === "super_admin") return "Admin";
  return ROLE_OPTIONS.find((o) => o.value === role)?.label ?? role;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

export default function AdminOperationsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "super_admin";
  const [orderToDelete, setOrderToDelete] = useState<AdminOrder | null>(null);

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

  const confirmPayment = useMutation({
    mutationFn: (id: string) => api(`/api/admin/orders/${id}/confirm-payment`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Payment confirmed");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: Error) => toast.error("Could not confirm payment", err.message),
  });

  const notifyDelivery = useMutation({
    mutationFn: (id: string) => api(`/api/admin/orders/${id}/notify-delivery`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Customer notified of delivery");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: Error) => toast.error("Could not notify customer", err.message),
  });

  const deleteOrder = useMutation({
    mutationFn: (id: string) => api(`/api/admin/orders/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Order deleted");
      setOrderToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err: Error) => toast.error("Could not delete order", err.message),
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api(`/api/admin/customers/${id}`, { method: "PATCH", body: JSON.stringify({ role }) }),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
    onError: (err: Error) => toast.error("Could not update role", err.message),
  });

  const removeSubscriber = useMutation({
    mutationFn: (id: string) => api(`/api/admin/newsletter/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Subscriber removed");
      queryClient.invalidateQueries({ queryKey: ["admin", "newsletter"] });
    },
    onError: (err: Error) => toast.error("Could not remove subscriber", err.message),
  });

  const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null);

  const orders = ordersQuery.data?.orders ?? [];
  const accounts = customersQuery.data?.accounts ?? [];
  const activity = customersQuery.data?.orderActivity ?? [];
  const subscribers = subscribersQuery.data?.subscribers ?? [];

  const orderColumns = [
    {
      header: "Order",
      accessor: (item: AdminOrder) => (
        <button onClick={() => setViewOrder(item)} className="text-left cursor-pointer hover:text-[#1C3322]">
          <span className="font-serif font-bold text-sm text-foreground block underline decoration-dotted underline-offset-2">
            {item.orderNumber}
          </span>
          <span className="text-[10px] text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
        </button>
      ),
    },
    {
      header: "Customer",
      accessor: (item: AdminOrder) => (
        <div>
          <span className="block">{item.customerName || "Guest"}</span>
          <span className="text-[10px] text-muted-foreground block">{item.customerEmail || "—"}</span>
          <span className="text-[10px] text-muted-foreground block">{item.customerPhone || "—"}</span>
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
    {
      header: "Actions",
      accessor: (item: AdminOrder) => (
        <div className="flex flex-col gap-1.5">
          {item.paymentMethod === "bank_transfer" &&
            (item.status === "pending" || item.status === "awaiting_confirmation") && (
              <Button
                size="sm"
                variant="outline"
                disabled={confirmPayment.isPending}
                onClick={() => confirmPayment.mutate(item.id)}
                className="!text-[10px] !py-1.5 whitespace-nowrap"
              >
                Confirm Payment
              </Button>
            )}
          {(item.status === "paid" || item.status === "shipped") && (
            <Button
              size="sm"
              variant="outline"
              disabled={notifyDelivery.isPending}
              onClick={() => notifyDelivery.mutate(item.id)}
              className="!text-[10px] !py-1.5 whitespace-nowrap"
            >
              Notify Delivery
            </Button>
          )}
          {isSuperAdmin && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOrderToDelete(item)}
              className="!text-[10px] !py-1.5 whitespace-nowrap text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  const accountColumns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    {
      header: "Role",
      accessor: (item: RegisteredAccount) =>
        isSuperAdmin && item.id !== session?.user?.id ? (
          <Select
            value={item.role || "customer"}
            onChange={(e) => updateRole.mutate({ id: item.id, role: e.target.value })}
            options={ROLE_OPTIONS}
            disabled={updateRole.isPending}
            className="!py-2 !text-[10px] w-40"
          />
        ) : (
          <Badge variant="secondary">{displayRoleLabel(item.role)}</Badge>
        ),
    },
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

  const tabContents = [
    {
      id: "orders",
      label: "Orders",
      content: (
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
            Orders ({orders.length})
          </h3>
          <Table columns={orderColumns} data={orders} loading={ordersQuery.isLoading} />
        </div>
      ),
    },
    {
      id: "customers",
      label: "Customers",
      content: (
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
              Order activity ({activity.length}) — grouped by email, checkout doesn&apos;t require an account
            </h3>
            <Table columns={activityColumns} data={activity} loading={customersQuery.isLoading} />
          </div>
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
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
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
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
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground mb-2">Operations</h1>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider font-sans">
            Real orders, customers and subscribers
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Live database
        </span>
      </div>

      <Tabs tabs={tabContents} />

      <Dialog isOpen={viewOrder !== null} onClose={() => setViewOrder(null)} title={viewOrder?.orderNumber}>
        {viewOrder && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <Badge variant={STATUS_VARIANT[viewOrder.status] ?? "secondary"}>{viewOrder.status.replace("_", " ")}</Badge>
              <span className="text-muted-foreground">{new Date(viewOrder.createdAt).toLocaleString()}</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Customer</h4>
              <p className="text-foreground">{viewOrder.customerName || "Guest"}</p>
              <p className="text-muted-foreground">{viewOrder.customerEmail || "—"}</p>
              <p className="text-muted-foreground">{viewOrder.customerPhone || "—"}</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Fulfilment</h4>
              <p className="text-foreground">{viewOrder.deliveryLabel}</p>
              <p className="text-muted-foreground whitespace-pre-line">{viewOrder.shippingAddress}</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Payment</h4>
              <p className="text-foreground capitalize">{viewOrder.paymentMethod.replace("_", " ")}</p>
              {viewOrder.paymentReference && (
                <p className="text-muted-foreground">Ref: {viewOrder.paymentReference}</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Items</h4>
              {viewOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-muted-foreground">
                    {item.productTitle}
                    {item.variantName ? ` — ${item.variantName}` : ""} × {item.quantity}
                    {item.bundleTitle && <span className="block text-[10px]">part of {item.bundleTitle}</span>}
                  </span>
                  <span className="font-serif text-foreground shrink-0 pl-3">
                    {naira(item.priceAtPurchase * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Items subtotal</span>
                <span>{naira(viewOrder.totalAmount - viewOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{viewOrder.deliveryLabel}</span>
                <span>{naira(viewOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-1">
                <span>Total paid</span>
                <span className="font-serif">{naira(viewOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        isOpen={orderToDelete !== null}
        onClose={() => setOrderToDelete(null)}
        title="Delete this order?"
      >
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            This permanently deletes order{" "}
            <span className="font-serif font-bold text-foreground">{orderToDelete?.orderNumber}</span> and
            its line items. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setOrderToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={deleteOrder.isPending}
              onClick={() => orderToDelete && deleteOrder.mutate(orderToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete order
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
