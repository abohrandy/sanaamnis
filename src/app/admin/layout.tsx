import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mockAdminProfile = {
    name: "Amnis Curator",
    email: "curator@sanaamnis.com",
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* Admin Sidebar */}
      <Sidebar userProfile={mockAdminProfile} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-neutral-950 p-8 md:p-12">
        <div className="max-w-7xl mx-auto w-full space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
