"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Sun,
  Moon,
  Keyboard,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  userProfile?: {
    name: string;
    email: string;
    image?: string;
  };
}

export function Sidebar({ className, userProfile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const pathname = usePathname() || "";
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, shortcut: "g d" },
    { label: "Catalog", href: "/admin/catalog", icon: ShoppingBag, shortcut: "g c" },
    { label: "Content (CMS)", href: "/admin/content", icon: FileText, shortcut: "g p" },
    { label: "Media Library", href: "/admin/media", icon: Image, shortcut: "g m" },
    { label: "Operations", href: "/admin/operations", icon: Users, shortcut: "g o" },
    { label: "Settings", href: "/admin/settings", icon: Settings, shortcut: "g s" },
  ];

  // Dark Mode side effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Keyboard Navigation Shortcuts
  useEffect(() => {
    let keysPressed = "";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside inputs
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      keysPressed += e.key.toLowerCase();
      
      if (keysPressed.endsWith("gd")) {
        router.push("/admin");
        keysPressed = "";
      } else if (keysPressed.endsWith("gc")) {
        router.push("/admin/catalog");
        keysPressed = "";
      } else if (keysPressed.endsWith("gp")) {
        router.push("/admin/content");
        keysPressed = "";
      } else if (keysPressed.endsWith("gm")) {
        router.push("/admin/media");
        keysPressed = "";
      } else if (keysPressed.endsWith("go")) {
        router.push("/admin/operations");
        keysPressed = "";
      } else if (keysPressed.endsWith("gs")) {
        router.push("/admin/settings");
        keysPressed = "";
      }

      if (keysPressed.length > 5) {
        keysPressed = keysPressed.slice(-2);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border/40 flex flex-col justify-between transition-all duration-300 relative z-30 shrink-0",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Sidebar header */}
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
            className="p-1.5 border border-border/60 hover:bg-muted transition-colors rounded-none absolute -right-3 top-7 bg-card text-foreground cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        {/* Sidebar items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-widest font-semibold font-sans transition-all duration-200 group rounded-xl",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-current" : "text-muted-foreground group-hover:text-foreground")} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && (
                  <span className="text-[8px] bg-background/40 px-1.5 py-0.5 rounded-sm opacity-60 font-mono lowercase">
                    {item.shortcut}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar profile & mode controllers footer */}
      <div className="p-4 border-t border-border/20 space-y-4">
        {/* Dark/Light mode toggler */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-widest font-semibold font-sans text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-all rounded-xl cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {darkMode ? <Moon className="w-4 h-4 shrink-0" /> : <Sun className="w-4 h-4 shrink-0" />}
            {!collapsed && <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>}
          </div>
        </button>

        {userProfile && !collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {userProfile.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate font-sans">{userProfile.name}</p>
              <p className="text-[10px] text-muted-foreground truncate font-sans">{userProfile.email}</p>
            </div>
          </div>
        ) : null}

        <Link
          href="/api/auth/sign-out"
          className="w-full flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest font-semibold font-sans text-destructive hover:bg-destructive/10 transition-colors rounded-xl"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
