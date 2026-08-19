"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/rbac";
import { signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Image,
  Loader2,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  userProfile: {
    name: string;
    email: string;
    role: string;
  };
}

/**
 * A nav item is shown only if the signed-in role holds at least one of the
 * permissions that section's routes actually check server-side (see
 * src/lib/admin-auth.ts). Previously every admin-tier role saw every section and
 * only discovered what they couldn't do when a save silently failed — the 403 a
 * route now returns became the *only* signal instead of a backstop.
 */
const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, permissions: ["view:analytics"], shortcutKey: "d" },
  { label: "Catalog", href: "/admin/catalog", icon: ShoppingBag, permissions: ["edit:catalog", "edit:coupons"], shortcutKey: "c" },
  { label: "Content", href: "/admin/content", icon: FileText, permissions: ["edit:blog", "edit:pages"], shortcutKey: "n" },
  { label: "Media Library", href: "/admin/media", icon: Image, permissions: ["edit:catalog", "edit:pages"], shortcutKey: "m" },
  { label: "Operations", href: "/admin/operations", icon: Users, permissions: ["view:orders", "view:customers"], shortcutKey: "o" },
  { label: "Settings", href: "/admin/settings", icon: Settings, permissions: ["edit:settings"], shortcutKey: "s" },
];

export function Sidebar({ className, userProfile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname() || "";
  const router = useRouter();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.permissions.some((p) => hasPermission(userProfile.role, p))
  );

  // Keyboard nav shortcuts (g d, g c, ...), scoped to visible items only.
  useEffect(() => {
    let keysPressed = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      keysPressed = (keysPressed + e.key.toLowerCase()).slice(-2);
      const match = visibleItems.find((item) => keysPressed === `g${item.shortcutKey}`);
      if (match) {
        router.push(match.href);
        keysPressed = "";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, visibleItems]);

  const handleLogout = async () => {
    // Previously a plain <Link href="/api/auth/sign-out"> — a GET navigation,
    // which does not invoke better-auth's sign-out flow and left the session
    // cookie intact.
    setSigningOut(true);
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border/40 flex flex-col justify-between transition-all duration-300 relative z-30 shrink-0",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-border/20">
          {!collapsed && (
            <span className="font-serif text-sm uppercase tracking-widest font-bold text-foreground">
              Amnis Hub
            </span>
          )}
          {collapsed && <span className="font-serif text-xs font-bold text-primary">SA</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 border border-border/60 hover:bg-muted transition-colors rounded-none absolute -right-3 top-7 bg-card text-foreground cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {visibleItems.map((item) => {
            // startsWith rather than exact match, so a future nested route like
            // /admin/catalog/[id] still highlights its parent section. Guarded so
            // "/admin" itself doesn't match every route (every admin path starts
            // with "/admin").
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-[10px] uppercase tracking-widest font-semibold font-sans transition-all duration-200 group rounded-xl",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-current" : "text-muted-foreground group-hover:text-foreground")} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/20 space-y-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {userProfile.name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate font-sans">{userProfile.name}</p>
              <p className="text-[10px] text-muted-foreground truncate font-sans">{userProfile.email}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="w-full flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest font-semibold font-sans text-destructive hover:bg-destructive/10 transition-colors rounded-xl cursor-pointer disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 shrink-0" />
          )}
          {!collapsed && <span>{signingOut ? "Signing out" : "Logout"}</span>}
        </button>
      </div>
    </aside>
  );
}
