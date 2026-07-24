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
    <div className="flex min-h-screen bg-[#121613] text-[#FAF8F5] font-sans overflow-hidden selection:bg-[#C9A227] selection:text-[#161A17]">
      {/* Admin Sidebar */}
      <Sidebar userProfile={mockAdminProfile} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#161A17] p-8 md:p-12">
        <div className="max-w-7xl mx-auto w-full space-y-10">
          {children}
        </div>
      </main>
    </div>
  );
}

