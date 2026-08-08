"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MapPin, Mail, CheckCircle2, Loader2, Phone } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      // The previous version called setSuccess(true) here regardless of what
      // happened next — nothing was ever actually sent anywhere.
      setStatus("done");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <div className="grid lg:grid-cols-2 gap-14 items-start mt-8">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
                Get in touch
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
                Questions? Ask us directly
              </h1>
              <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
                Which oil to cook with, order tracking, bulk orders — we read and answer
                every message ourselves.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#E2E6E3]">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#161A17]">
                    Main Office · Community Mart Limited
                  </h2>
                  <p className="text-sm text-[#676E6A] leading-relaxed">
                    Plot 506, Cadastral Zone, Dakibiyu — behind Christ Embassy, Dakibiyu,
                    Jabi, Abuja
                  </p>
                  <p className="text-sm text-[#676E6A] mt-1">Closest bustop is Jabi mosholashi</p>
                  <a
                    href="tel:+2349137358352"
                    className="inline-flex items-center gap-1.5 text-sm text-[#1C3322] font-semibold hover:text-[#C9A227] transition-colors mt-1"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" /> Call +234 913 735 8352 for directions
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#161A17]">Email</h2>
                  <a href="mailto:concierge@sanaamnis.com" className="text-sm text-[#676E6A] hover:text-[#1C3322] transition-colors">
                    concierge@sanaamnis.com
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E6E3]/70 space-y-3">
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#161A17]">Other Locations</h2>
                <p className="text-sm text-[#676E6A] leading-relaxed">Pickup locations and distributors are listed on our distributors page.</p>
                <a href="/distributors" className="text-sm text-[#1C3322] font-semibold underline underline-offset-4 hover:text-[#C9A227]">View locations</a>
              </div>

              <div className="pt-2 border-t border-[#E2E6E3]/70 space-y-2">
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#161A17]">Auditors</h2>
                <p className="text-sm text-[#676E6A]">Details to be confirmed.</p>
              </div>

              <div className="pt-2 border-t border-[#E2E6E3]/70 space-y-2">
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#161A17]">Stockists & Distributors</h2>
                <p className="text-sm text-[#676E6A]">See current locations or use the form to enquire about becoming a distributor.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E2E6E3] rounded-[1.5rem] p-7 md:p-9 shadow-ambient-sm space-y-6">
            {status === "done" ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#C9A227] mx-auto" aria-hidden="true" />
                <h2 className="font-serif text-xl font-medium text-[#161A17]">Message sent</h2>
                <p className="text-sm text-[#676E6A] max-w-sm mx-auto">
                  Thank you — we will reply to your email as soon as we can, usually within a
                  working day.
                </p>
                <Button variant="outline" size="md" onClick={() => setStatus("idle")}>
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-xl font-medium text-[#161A17] pb-4 border-b border-[#E2E6E3]">
                  Send us a message
                </h2>

                {status === "error" && (
                  <p role="alert" className="text-xs font-semibold text-[#8C531B] bg-[#8C531B]/10 border border-[#8C531B]/25 rounded-[0.5rem] p-3">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <Input
                    label="Your name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Email address"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div className="absolute left-[-9999px]" aria-hidden="true">
                    <label htmlFor="contact-company">Company</label>
                    <input
                      id="contact-company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#676E6A] block"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      minLength={10}
                      className="w-full bg-[#FAF8F5] border border-[#E2E6E3] rounded-[0.875rem] py-3.5 px-4 text-sm text-[#161A17] placeholder:text-[#676E6A]/60 outline-none focus:border-[#1C3322] min-h-[130px] resize-none"
                      placeholder="How can we help?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="botanical"
                    size="lg"
                    disabled={status === "submitting"}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send message
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
