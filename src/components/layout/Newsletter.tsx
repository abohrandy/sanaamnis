"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="relative py-20 px-6 bg-[#1C3322] text-[#FAF8F5] overflow-hidden rounded-[1.5rem] my-12 border border-gold-hairline shadow-ambient-lg">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FAF8F5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center mb-6">
          <Sparkles className="w-5 h-5" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#C9A227] mb-2">
          Exclusive Botanical Access
        </span>

        <h2 className="font-serif font-medium text-3xl md:text-5xl text-[#FAF8F5] mb-4 leading-tight">
          Join the Sanctuary Gazette
        </h2>

        <p className="text-sm md:text-base text-[#FAF8F5]/80 font-sans leading-relaxed max-w-xl mb-8">
          Subscribe to receive limited batch harvest releases, private masterclass invitations, and seasonal organic wellness recipes.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 rounded-[0.875rem] glass-obsidian text-[#FAF8F5]"
          >
            <CheckCircle2 className="w-6 h-6 text-[#C9A227]" />
            <span className="font-sans text-sm font-semibold">
              Welcome to Sana Amnis. Your complimentary welcome guide has been dispatched.
            </span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-[#FAF8F5] text-[#161A17] border-transparent shadow-ambient-sm"
              />
            </div>
            <Button variant="gold" size="lg" type="submit" className="shrink-0 flex items-center gap-2">
              Subscribe <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

