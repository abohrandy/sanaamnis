"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  MessageSquare,
  Award,
  Shield,
  Bell,
  LogOut,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Star,
  Lock,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistGrid } from "@/components/shop/WishlistGrid";
import { useWishlistStore } from "@/store/wishlistStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { useSession } from "@/lib/auth-client";
import { formatNaira } from "@/lib/catalog";
import Link from "next/link";

export interface AccountOrder {
  id: string;
  reference: string;
  status: string;
  total: number;
  date: string;
  items: Array<{
    title: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
}

export type AccountTab =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "reviews"
  | "rewards"
  | "security"
  | "notifications";

export function AccountClient() {
  const { data: session } = useSession();
  const hydrated = useHydrated();
  const wishlistCount = useWishlistStore((s) => (hydrated ? s.items.length : 0));

  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  // Seeded from the signed-in session rather than a hardcoded persona.
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    setProfileName((current) => current || session.user.name || "");
    setProfileEmail((current) => current || session.user.email || "");
  }, [session]);

  // Real orders replace the two hardcoded ones — complete with invented courier
  // names and tracking numbers — that used to be shown to every visitor.
  useEffect(() => {
    let cancelled = false;
    if (!session?.user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    fetch("/api/account/orders")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((data) => {
        if (!cancelled) setOrders(data.orders ?? []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [harvestDrops, setHarvestDrops] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const TABS = [
    { id: "overview", label: "Account Overview", icon: User },
    { id: "orders", label: "Orders Archive", icon: ShoppingBag, badge: orders.length },
    { id: "wishlist", label: "Saved Formulations", icon: Heart, badge: wishlistCount },
    { id: "addresses", label: "Saved Destinations", icon: MapPin },
    { id: "reviews", label: "My Critiques", icon: MessageSquare },
    { id: "rewards", label: "Glass Circle Rewards", icon: Award },
    { id: "security", label: "Profile & Security", icon: Shield },
    { id: "notifications", label: "Preferences", icon: Bell },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-4 space-y-6">
        {/* User Card */}
        <div className="p-6 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1C3322] text-[#FAF8F5] flex items-center justify-center font-serif text-xl font-bold border-2 border-[#C9A227]">
              CO
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#161A17]">{profileName}</h3>
              <Badge variant="gold">BOTANICAL PATRON TIER</Badge>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E6E3] space-y-1.5 text-xs text-[#676E6A]">
            <p className="truncate">Email: <span className="font-semibold text-[#161A17]">{profileEmail}</span></p>
            <p>Member Since: <span className="font-semibold text-[#161A17]">January 2025</span></p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="p-3 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AccountTab)}
                className={`w-full px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm"
                    : "text-[#161A17] hover:bg-[#F3EFE8]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#C9A227]" : "text-[#1C3322]"}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? "bg-[#C9A227] text-[#161A17] font-bold" : "bg-[#F3EFE8] text-[#676E6A]"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <Link
            href="/api/auth/sign-out"
            className="w-full px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-[0.15em] text-red-700 hover:bg-red-50 transition-colors flex items-center gap-3 cursor-pointer mt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Tab Content Panel */}
      <main className="lg:col-span-8 space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#676E6A]">Total Orders</span>
                <span className="font-serif text-3xl font-bold text-[#1C3322] block">{orders.length}</span>
                <span className="text-[10px] text-green-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All Delivered Cleanly
                </span>
              </div>

              <div className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#676E6A]">Saved Formulations</span>
                <span className="font-serif text-3xl font-bold text-[#1C3322] block">{wishlistCount}</span>
                <button onClick={() => setActiveTab("wishlist")} className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wider hover:underline">
                  View Wishlist →
                </button>
              </div>

              <div className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#676E6A]">Glass Circle Points</span>
                <span className="font-serif text-3xl font-bold text-[#1C3322] block">450 PTS</span>
                <span className="text-[10px] text-[#676E6A] font-semibold">5 Amber Bottles Returned</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E6E3] pb-4">
                <h3 className="font-serif text-xl font-medium text-[#161A17]">Recent Order</h3>
                <button onClick={() => setActiveTab("orders")} className="text-xs font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227]">
                  View All Archive →
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#161A17] block">{orders[0]?.reference ?? "—"}</span>
                    <span className="text-[10px] text-[#676E6A] font-sans">{orders[0] ? new Date(orders[0].date).toLocaleDateString("en-NG") : "No orders yet"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="gold">{orders[0]?.status ?? "—"}</Badge>
                    <span className="font-serif font-bold text-base text-[#1C3322]">{orders[0] ? formatNaira(orders[0].total) : "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#161A17]">Your orders</h2>

            {ordersLoading ? (
              <p className="text-sm text-[#676E6A] py-10 text-center">Loading your orders…</p>
            ) : orders.length === 0 ? (
              <div className="py-16 px-8 text-center rounded-[1.5rem] border border-dashed border-[#E2E6E3] bg-[#F3EFE8]/40 space-y-4">
                <Package className="w-6 h-6 text-[#C9A227] mx-auto" />
                <h3 className="font-serif text-lg font-medium text-[#161A17]">No orders yet</h3>
                <p className="text-sm text-[#676E6A] max-w-sm mx-auto leading-relaxed">
                  Orders you place while signed in will appear here.
                </p>
                <Link href="/shop" className="inline-block pt-1">
                  <Button variant="botanical" size="md">Start shopping</Button>
                </Link>
              </div>
            ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E6E3]">
                    <div>
                      <span className="font-serif text-lg font-bold text-[#161A17]">{order.reference}</span>
                      <span className="text-xs text-[#676E6A] font-sans block">
                        {new Date(order.date).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="gold">{order.status}</Badge>
                      <span className="font-serif text-xl font-bold text-[#1C3322]">₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-[0.75rem] bg-[#F3EFE8] border border-[#E2E6E3]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded-[0.375rem] bg-[#E2E6E3] overflow-hidden shrink-0">
                            <Image src={item.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-[#161A17]">{item.title}</h4>
                            <span className="text-[10px] text-[#676E6A]">{item.name} × {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-serif text-xs font-bold text-[#1C3322]">₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E6E3] text-xs font-sans">
                    <span className="text-[#676E6A] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#C9A227]" />
                      Questions about this order? Quote {order.reference}.
                    </span>
                    <Link
                      href="/contact"
                      className="px-4 py-2 rounded-[0.5rem] border border-[#E2E6E3] bg-[#FAF8F5] text-[10px] uppercase font-bold tracking-wider hover:bg-[#F3EFE8] transition-colors flex items-center gap-1.5"
                    >
                      Contact us <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#161A17]">Saved items</h2>

            <WishlistGrid columns={2} />
          </div>
        )}

        {/* SAVED DESTINATIONS TAB */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#161A17]">Delivery addresses</h2>

            <div className="py-16 px-8 text-center rounded-[1.5rem] border border-dashed border-[#E2E6E3] bg-[#F3EFE8]/40 space-y-4">
              <MapPin className="w-6 h-6 text-[#C9A227] mx-auto" />
              <h3 className="font-serif text-lg font-medium text-[#161A17]">
                No saved addresses
              </h3>
              <p className="text-sm text-[#676E6A] max-w-sm mx-auto leading-relaxed">
                We do not store an address book yet — you enter your delivery address at
                checkout each time. If you would like saved addresses, tell us and we
                will add it.
              </p>
              <Link href="/contact" className="inline-block pt-1">
                <Button variant="outline" size="md">Send feedback</Button>
              </Link>
            </div>
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === "rewards" && (
          <div className="p-8 md:p-10 rounded-[1.5rem] bg-[#161A17] text-[#FAF8F5] border border-gold-hairline shadow-ambient-lg space-y-5">
            <Badge variant="gold">Coming soon</Badge>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#FAF8F5]">
              A rewards programme is on the way
            </h2>
            <p className="text-sm text-[#FAF8F5]/75 leading-relaxed max-w-xl">
              We are putting together a scheme that rewards repeat orders and returned
              packaging. Join the mailing list and we will tell you the moment it opens.
            </p>
          </div>
        )}

        {/* SECURITY & PROFILE TAB */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#161A17]">Profile & Security Settings</h2>

            <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
              <h3 className="font-serif text-lg font-medium text-[#161A17] pb-3 border-b border-[#E2E6E3]">Personal Contact Info</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A]">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans outline-none focus:border-[#1C3322]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A]">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans outline-none focus:border-[#1C3322]"
                  />
                </div>
              </div>

              <Button variant="botanical" size="md">Save Profile Updates</Button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#161A17]">Notification Preferences</h2>

            <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E6E3]">
                <div>
                  <h4 className="font-serif text-base font-medium text-[#161A17]">Order Dispatch Alerts</h4>
                  <p className="text-xs text-[#676E6A]">Receive email notifications with courier tracking for every order dispatch.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 accent-[#1C3322] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-[#E2E6E3]">
                <div>
                  <h4 className="font-serif text-base font-medium text-[#161A17]">Fresh Harvest Drop Announcements</h4>
                  <p className="text-xs text-[#676E6A]">Get an email the moment a new batch or product goes live.</p>
                </div>
                <input
                  type="checkbox"
                  checked={harvestDrops}
                  onChange={(e) => setHarvestDrops(e.target.checked)}
                  className="w-5 h-5 accent-[#1C3322] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
