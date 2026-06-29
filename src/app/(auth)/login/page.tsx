"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { LogIn, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-card border border-border/40 p-8 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Concierge Portal
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white">
            SANA AMNIS
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            Please authenticate to access editorial tools and inventories.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider">
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
            placeholder="curator@sanaamnis.com"
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
            className="w-full flex items-center justify-center gap-2 rounded-none"
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

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <hr className="w-full border-border/20" />
          <span className="absolute px-4 bg-card text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
            Or Options
          </span>
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 border border-border text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-all duration-300 rounded-none text-foreground"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" fillOpacity="1" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign In with Google
        </button>

        {/* Disclaimer / Redirect links */}
        <div className="text-center pt-4 border-t border-border/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold font-sans">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            ← Storefront
          </Link>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> RBAC Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
