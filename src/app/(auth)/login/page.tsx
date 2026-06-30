"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { LogIn, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/admin", // Redirecting to admin on successful auth
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid credentials. Please verify your email and password.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/admin",
      });
    } catch (err: any) {
      console.error(err);
      setError("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f0d] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-[#FAF9F6] border border-neutral-200/60 p-8 shadow-[0_15px_50px_rgba(53,94,59,0.15)] space-y-8 rounded-2xl">
        {/* Header with official Long Coconut Logo */}
        <div className="text-center space-y-2">
          <img
            src="/logo_long.png"
            alt="Sana Amnis Premium Coconuts"
            className="mx-auto h-12 w-auto object-contain mb-2"
          />
          <p className="text-xs text-[#6B7280] leading-relaxed font-sans">
            Please authenticate to access editorial tools and inventories.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold uppercase tracking-wider">
            {error}
          </div>
        )}

        {/* Email form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abohrandy@gmail.com"
          />
          <Input
            label="Security Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#355E3B] hover:bg-[#274f2e] text-white py-3 text-xs uppercase tracking-widest font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Disclaimer / Redirect links */}
        <div className="text-center pt-4 border-t border-neutral-200/60 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#6B7280] font-bold font-sans">
          <Link href="/" className="hover:text-[#355E3B] transition-colors flex items-center gap-1">
            ← Storefront
          </Link>
          <span className="flex items-center gap-1 text-[#355E3B]">
            <ShieldCheck className="w-3.5 h-3.5" /> RBAC Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
