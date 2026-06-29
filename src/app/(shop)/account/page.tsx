import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { User, ClipboardList, ShieldAlert, LogOut } from "lucide-react";

interface OrderMock {
  reference: string;
  date: string;
  total: string;
  status: string;
}

const MOCK_ORDERS: OrderMock[] = [
  {
    reference: "AMNIS-8902",
    date: "June 25, 2026",
    total: "30500.00",
    status: "Delivered",
  },
  {
    reference: "AMNIS-7712",
    date: "May 14, 2026",
    total: "12500.00",
    status: "Delivered",
  },
];

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-12">
        {/* Intro */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Customer Dashboard
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            My Sanctuary Profile
          </h1>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* User Details Box */}
          <div className="bg-card border border-border/40 rounded-2xl p-8 space-y-6 shadow-[0_10px_40px_rgba(53,94,59,0.02)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  Chika Obi
                </h3>
                <p className="text-xs text-muted-foreground">Registered Collector</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans text-muted-foreground pt-4 border-t border-border/20">
              <div>
                <span className="uppercase tracking-widest font-bold block text-[9px] mb-1">
                  Email Contact
                </span>
                <span className="text-foreground">chika.obi@gmail.com</span>
              </div>
              <div>
                <span className="uppercase tracking-widest font-bold block text-[9px] mb-1">
                  Shipping Destination
                </span>
                <span className="text-foreground leading-relaxed block">
                  Plot 12, Admiralty Way, Phase 1, Lekki, Lagos
                </span>
              </div>
            </div>

            <Link
              href="/api/auth/sign-out"
              className="w-full py-4 border border-border text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-destructive hover:text-white hover:border-destructive transition-all rounded-xl mt-6"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Link>
          </div>

          {/* Orders History Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-medium text-foreground">
                Orders Archive
              </h2>
            </div>

            {MOCK_ORDERS.length > 0 ? (
              <div className="space-y-4">
                {MOCK_ORDERS.map((o) => (
                  <div
                    key={o.reference}
                    className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-[0_10px_40px_rgba(53,94,59,0.01)] hover:border-border transition-colors duration-300"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-foreground">
                        {o.reference}
                      </span>
                      <p className="text-[10px] text-muted-foreground">{o.date}</p>
                    </div>

                    <div className="flex items-center gap-8 justify-between md:justify-end">
                      <span className="text-xs px-3 py-1 bg-primary/10 text-primary font-bold rounded-full uppercase tracking-wider">
                        {o.status}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        ₦{parseFloat(o.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-card border border-border/20 rounded-2xl">
                <p className="text-xs text-muted-foreground">
                  No orders verified for this account yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
