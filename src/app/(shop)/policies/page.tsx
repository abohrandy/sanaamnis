import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 w-full space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Customer Charters
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Sana Amnis Charters & Policies
          </h1>
        </div>

        {/* Narrative columns */}
        <div className="grid md:grid-cols-2 gap-12 pt-6 border-t border-border/20">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Shipping & Deliveries
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We deliver organic items within Lagos state in 24 hours. For other states in Nigeria, please allow 3–5 working days. International orders are handled via express courier tracks.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Returns & Exchanges
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Due to the pure, organic botanical nature of our cosmetic elixirs and ingestibles, we are unable to accept returns of opened glass jars. For damaged arrivals, please notify concierge support in 48 hours for immediate replacements.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Privacy Commitments
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We encrypt and safeguard all customer shipping coordinates and profiles securely. Your search logs and order catalogs are strictly kept confidential.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Ethical Standards
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We source raw coconut items from local coastal farmers in Nigeria, paying premiums above standard market rates to support rural agrarian groves.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
