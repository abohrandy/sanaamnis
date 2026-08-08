"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth-client";
import { LogIn, Loader2, UserPlus, ArrowLeft } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  // Send the customer back to the page they came from (e.g. checkout) once
  // signed in, rather than always landing on /account.
  const redirectTo = searchParams.get("redirect") || "/account";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Both flows previously redirected to /admin — a customer who just made an
      // account was sent straight into a page the middleware then blocked with
      // "Forbidden: Administrative Credentials Required".
      if (mode === "signin") {
        const res = await signIn.email({ email, password, callbackURL: redirectTo });
        if (res?.error) {
          setError(res.error.message || "Could not sign in. Check your email and password.");
          setIsSubmitting(false);
          return;
        }
        window.location.href = redirectTo;
      } else {
        const res = await signUp.email({ email, password, name, callbackURL: redirectTo });
        if (res?.error) {
          setError(res.error.message || "Could not create your account.");
          setIsSubmitting(false);
          return;
        }
        window.location.href = redirectTo;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C3322] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-[#FAF8F5] border border-[#E2E6E3] p-8 md:p-10 shadow-ambient-lg space-y-8 rounded-[1.5rem]">
        <div className="text-center space-y-3">
          <Image
            src="/logo3.png"
            alt="Sana Amnis"
            width={329}
            height={217}
            priority
            className="mx-auto h-20 w-auto object-contain"
          />
          <p className="text-sm text-[#676E6A] leading-relaxed">
            {mode === "signin"
              ? "Sign in to see your orders and saved items."
              : "Create an account to track orders and save products."}
          </p>
        </div>

        <div className="flex border-b border-[#E2E6E3]" role="tablist">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`flex-1 pb-3 text-[11px] uppercase tracking-[0.16em] font-bold transition-colors cursor-pointer ${
                mode === m
                  ? "border-b-2 border-[#1C3322] text-[#1C3322]"
                  : "text-[#676E6A] hover:text-[#161A17]"
              }`}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="p-3.5 rounded-[0.5rem] bg-[#8C531B]/10 border border-[#8C531B]/25 text-[#8C531B] text-xs font-semibold"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <Input
              label="Full name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          )}

          <Input
            label="Email address"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            variant="botanical"
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {mode === "signin" ? "Signing in…" : "Creating account…"}
              </>
            ) : mode === "signin" ? (
              <>
                <LogIn className="w-4 h-4" /> Sign in
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Create account
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#676E6A] hover:text-[#1C3322] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
