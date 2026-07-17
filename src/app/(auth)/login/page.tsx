"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth-client";
import { LogIn, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (mode === "signin") {
        await signIn.email({
          email,
          password,
          callbackURL: "/admin", // Redirecting to admin on successful auth
        });
      } else {
        await signUp.email({
          email,
          password,
          name,
          callbackURL: "/admin",
        });
        setSuccessMessage("Account created successfully! Redirecting...");
        // Explicit client-side redirect fallback
        window.location.href = "/admin";
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication process failed. Please verify inputs.");
      setIsSubmitting(false);
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
            {mode === "signin" 
              ? "Please authenticate to access editorial tools and inventories." 
              : "Register your secure account credentials to join the network."}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => { setMode("signin"); setError(""); setSuccessMessage(""); }}
            className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold transition-all ${
              mode === "signin"
                ? "border-b-2 border-[#355E3B] text-[#355E3B]"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); setSuccessMessage(""); }}
            className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold transition-all ${
              mode === "signup"
                ? "border-b-2 border-[#355E3B] text-[#355E3B]"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold uppercase tracking-wider">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Randy A."
            />
          )}

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
                {mode === "signin" ? "Verifying Credentials..." : "Creating Account..."}
              </>
            ) : (
              <>
                {mode === "signin" ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </>
                )}
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
