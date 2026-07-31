import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastProvider } from "@/hooks/useToast";

/**
 * Defense in depth alongside src/middleware.ts, and the source of the sidebar's
 * identity — previously hardcoded to "Amnis Curator <curator@sanaamnis.com>"
 * regardless of who was actually signed in.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

  if (!session?.user || !isAdminRole(session.user.role)) {
    redirect("/login?redirect=/admin");
  }

  const profile = {
    name: session.user.name,
    email: session.user.email,
    role: session.user.role ?? "",
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#121613] text-[#FAF8F5] font-sans overflow-hidden selection:bg-[#C9A227] selection:text-[#161A17]">
        <Sidebar userProfile={profile} />

        <main className="flex-1 h-screen overflow-y-auto bg-[#161A17] p-8 md:p-12">
          <div className="max-w-7xl mx-auto w-full space-y-10">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
