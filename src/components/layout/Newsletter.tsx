"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "done" | "error";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "submitting") return;

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), company }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setStatus("done");
      setEmail("");
    } catch (err) {
      // This form used to declare "your complimentary welcome guide has been
      // dispatched" without sending anything anywhere. It now only claims success
      // when the address has actually been recorded.
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="relative py-16 md:py-20 px-6 bg-[#1C3322] text-[#FAF8F5] overflow-hidden rounded-[1.5rem] border border-gold-hairline shadow-ambient-lg">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FAF8F5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center mb-5">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C9A227] mb-2">
          Stay in touch
        </span>

        <h2 className="font-serif font-medium text-3xl md:text-4xl text-[#FAF8F5] mb-4 leading-tight tracking-tight">
          New batches, recipes and offers
        </h2>

        <p className="text-sm md:text-base text-[#FAF8F5]/75 leading-relaxed max-w-lg mb-8">
          An occasional email when a new product lands or something is on offer. No more
          than once or twice a month, and you can unsubscribe from any of them.
        </p>

        {status === "done" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            role="status"
            className="flex items-center gap-3 px-5 py-4 rounded-[0.875rem] glass-obsidian text-[#FAF8F5]"
          >
            <CheckCircle2 className="w-5 h-5 text-[#C9A227] shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">
              You are on the list — thank you.
            </span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3" noValidate>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "newsletter-error" : undefined}
                  className="bg-[#FAF8F5] text-[#161A17] border-transparent shadow-ambient-sm w-full"
                />
              </div>

              {/* Honeypot — hidden from people, tempting to bots. */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="newsletter-company">Company</label>
                <input
                  id="newsletter-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <Button
                variant="gold"
                size="lg"
                type="submit"
                disabled={status === "submitting"}
                className="shrink-0 flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing up
                  </>
                ) : (
                  <>
                    Subscribe <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {status === "error" && (
              <p
                id="newsletter-error"
                role="alert"
                className="text-xs text-[#F3EFE8] bg-[#8C531B]/30 border border-[#C9A227]/30 rounded-[0.5rem] px-3 py-2"
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
