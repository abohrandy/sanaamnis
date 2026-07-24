"use client";

import React, { useState } from "react";
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
import { ProductCard } from "@/components/ds/cards/product-card";
import Link from "next/link";

export type AccountTab =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "reviews"
  | "rewards"
  | "security"
  | "notifications";

const MOCK_ORDERS = [
  {
    id: "ord-1",
    reference: "AMNIS-8902",
    date: "June 25, 2026",
    total: 30500,
    status: "Delivered",
    items: [
      {
        title: "Extra Virgin Coconut Oil",
        name: "500ml Glass Bottle",
        quantity: 1,
        price: 28000,
        imageUrl: "https://drive.google.com/thumbnail?id=19MfciPsk515kPomAxziUo3PT_x_-y6K_&sz=w300",
      },
      {
        title: "Sana Amnis Coconut Water",
        name: "250ml Pouch Pack",
        quantity: 1,
        price: 2500,
        imageUrl: "https://drive.google.com/thumbnail?id=19MfciPsk515kPomAxziUo3PT_x_-y6K_&sz=w300",
      },
    ],
    courier: "DHL Priority Express",
    trackingNumber: "DHL-NG-889912",
  },
  {
    id: "ord-2",
    reference: "AMNIS-7712",
    date: "May 14, 2026",
    total: 12500,
    status: "Delivered",
    items: [
      {
        title: "Exfoliating Coconut Sugar Scrub",
        name: "200g Glass Jar",
        quantity: 1,
        price: 12500,
        imageUrl: "https://drive.google.com/thumbnail?id=1kfVkQ-lqEpTKfvtl_WT-zwa28NeEOO1n&sz=w300",
      },
    ],
    courier: "GIG Logistics Express",
    trackingNumber: "GIG-7712-LA",
  },
];

const MOCK_WISHLIST = [
  {
    id: "4",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: 18000,
    imageUrl: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w1000",
  },
  {
    id: "5",
    title: "Restorative Coconut Hair Mask",
    slug: "restorative-coconut-hair-mask",
    category: "Hair & Body",
    price: 14000,
    imageUrl: "https://drive.google.com/thumbnail?id=1--CLF51noixdnvV8HhLmosvtP75RDlRE&sz=w1000",
  },
];

const MOCK_ADDRESSES = [
  {
    id: "addr-1",
    isDefault: true,
    label: "Primary Residence",
    name: "Chika Obi",
    phone: "+234 803 123 4567",
    street: "Plot 12, Admiralty Way, Phase 1",
    city: "Lekki",
    state: "Lagos State",
    country: "Nigeria",
  },
  {
    id: "addr-2",
    isDefault: false,
    label: "Office Sanctuary",
    name: "Chika Obi",
    phone: "+234 803 123 4567",
    street: "Tower 2, Victoria Island Commercial Hub",
    city: "Victoria Island",
    state: "Lagos State",
    country: "Nigeria",
  },
];

export function AccountClient() {
  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [profileName, setProfileName] = useState("Chika Obi");
  const [profileEmail, setProfileEmail] = useState("chika.obi@gmail.com");
  const [profilePhone, setProfilePhone] = useState("+234 803 123 4567");

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [harvestDrops, setHarvestDrops] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const TABS = [
    { id: "overview", label: "Sanctuary Overview", icon: User },
    { id: "orders", label: "Orders Archive", icon: ShoppingBag, badge: MOCK_ORDERS.length },
    { id: "wishlist", label: "Saved Formulations", icon: Heart, badge: MOCK_WISHLIST.length },
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
                <span className="font-serif text-3xl font-bold text-[#1C3322] block">{MOCK_ORDERS.length}</span>
                <span className="text-[10px] text-green-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All Delivered Cleanly
                </span>
              </div>

              <div className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#676E6A]">Saved Formulations</span>
                <span className="font-serif text-3xl font-bold text-[#1C3322] block">{MOCK_WISHLIST.length}</span>
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
                <h3 className="font-serif text-xl font-medium text-[#161A17]">Recent Sanctuary Order</h3>
                <button onClick={() => setActiveTab("orders")} className="text-xs font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227]">
                  View All Archive →
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#161A17] block">{MOCK_ORDERS[0].reference}</span>
                    <span className="text-[10px] text-[#676E6A] font-sans">{MOCK_ORDERS[0].date} — {MOCK_ORDERS[0].courier}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="gold">{MOCK_ORDERS[0].status}</Badge>
                    <span className="font-serif font-bold text-base text-[#1C3322]">₦{MOCK_ORDERS[0].total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#161A17]">Orders Archive</h2>

            <div className="space-y-6">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E6E3]">
                    <div>
                      <span className="font-serif text-lg font-bold text-[#161A17]">{order.reference}</span>
                      <span className="text-xs text-[#676E6A] font-sans block">{order.date}</span>
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
                          <div className="w-10 h-12 rounded-[0.375rem] bg-[#E2E6E3] overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
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

                  {/* Tracking Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E6E3] text-xs font-sans">
                    <span className="text-[#676E6A] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#C9A227]" /> {order.courier} — Tracking Code: <strong className="text-[#161A17]">{order.trackingNumber}</strong>
                    </span>

                    <button className="px-4 py-2 rounded-[0.5rem] border border-[#E2E6E3] bg-[#FAF8F5] text-[10px] uppercase font-bold tracking-wider hover:bg-[#F3EFE8] transition-colors flex items-center gap-1.5 cursor-pointer">
                      Track Package <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#161A17]">Saved Formulations</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {MOCK_WISHLIST.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  slug={item.slug}
                  category={item.category}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  isWishlisted
                />
              ))}
            </div>
          </div>
        )}

        {/* SAVED DESTINATIONS TAB */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-medium text-[#161A17]">Saved Shipping Destinations</h2>
              <Button variant="botanical" size="sm" className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-[#161A17]">{addr.label}</span>
                      {addr.isDefault && <Badge variant="gold">PRIMARY DESTINATION</Badge>}
                    </div>

                    <div className="text-xs font-sans text-[#676E6A] space-y-1 pt-2">
                      <p className="font-semibold text-[#161A17]">{addr.name}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state}, {addr.country}</p>
                      <p>{addr.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#E2E6E3]">
                    <button className="text-xs text-[#1C3322] font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    {!addr.isDefault && (
                      <button className="text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === "rewards" && (
          <div className="p-8 rounded-[1.5rem] bg-[#161A17] text-[#FAF8F5] border border-gold-hairline shadow-ambient-lg space-y-6">
            <Badge variant="gold">CIRCULAR GLASS REWARDS</Badge>
            <h2 className="font-serif text-3xl font-medium text-[#FAF8F5]">Amber Glass Return Program</h2>
            <p className="text-xs md:text-sm font-sans text-[#FAF8F5]/80 leading-relaxed max-w-xl">
              Return 5 empty amber glass bottles to any Sana Amnis sanctuary drop-off point in Lagos or Abuja to unlock a complimentary 250ml Nectar voucher.
            </p>

            <div className="p-6 rounded-[1rem] bg-[#FAF8F5]/10 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A227]">Your Balance</span>
                <span className="font-serif text-3xl font-bold text-[#FAF8F5] block">450 Points</span>
              </div>
              <Button variant="gold" size="md">Redeem Voucher</Button>
            </div>
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
                  <p className="text-xs text-[#676E6A]">Get priority notifications when new cold-pressed virgin batches arrive from Badagry.</p>
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
