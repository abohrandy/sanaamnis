"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-16 items-start">
        {/* Info Column */}
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
              Concierge Communications
            </span>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Get in Touch
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have questions about our coconut oil extractions or shipping policies? Our client services concierge is ready to assist.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-border/20">
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-foreground">
                  Lagos Sanctuary
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Plot 12, Admiralty Way, Phase 1, Lekki, Lagos
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-foreground">
                  Phone Hotlines
                </h4>
                <p className="text-xs text-muted-foreground mt-1">+234 812 345 6789</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-foreground">
                  Email Services
                </h4>
                <p className="text-xs text-muted-foreground mt-1">concierge@sanaamnis.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Box */}
        <div className="bg-card border border-border/40 rounded-2xl p-8 space-y-6 shadow-[0_10px_40px_rgba(53,94,59,0.02)]">
          <h3 className="font-serif text-xl font-medium text-foreground pb-4 border-b border-border/20">
            Send Inquiry Message
          </h3>

          {success && (
            <div className="p-4 bg-primary/10 text-primary text-xs uppercase tracking-wider font-bold">
              Message submitted successfully. Our concierge will contact you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chika Obi"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chika.obi@gmail.com"
            />

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground font-sans">
                Inquiry Details
              </label>
              <textarea
                required
                className="w-full bg-background border border-border/40 rounded-xl py-3 px-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] resize-none"
                placeholder="Enter details here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl"
            >
              <Send className="w-4 h-4" />
              Submit Form
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
