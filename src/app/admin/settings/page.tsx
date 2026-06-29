"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ds/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ds/table";
import { Save, Plus, Trash2 } from "lucide-react";

const INITIAL_REDIRECTS = [
  { id: "1", fromPath: "/old-about", toPath: "/about" },
  { id: "2", fromPath: "/collection/winter", toPath: "/catalog?category=coats" },
];

export default function AdminSettingsPage() {
  const [seoTitle, setSeoTitle] = useState("Sana Amnis | Premium Minimalist eCommerce");
  const [seoDesc, setSeoDesc] = useState("Timeless garments designed with architectural precision.");
  const [phone, setPhone] = useState("+234 812 345 6789");
  const [email, setEmail] = useState("concierge@sanaamnis.com");
  const [redirects, setRedirects] = useState(INITIAL_REDIRECTS);

  // Redirect tables columns
  const redirectColumns = [
    { header: "Requested Path", accessor: "fromPath" as const },
    { header: "Target Redirect Path", accessor: "toPath" as const },
    {
      header: "Actions",
      accessor: (item: typeof INITIAL_REDIRECTS[0]) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRedirects(redirects.filter((r) => r.id !== item.id))}
          className="p-1 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  const tabContents = [
    {
      id: "seo",
      label: "Global Search Engine Optimization",
      content: (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 max-w-xl">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans mb-4">Meta Tag Defaults</h3>
          <Input
            label="Default SEO Page Title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
          <Input
            label="Default Meta Description"
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
          />
          <Button className="flex items-center gap-1.5 rounded-none">
            <Save className="w-3.5 h-3.5" /> Save SEO Settings
          </Button>
        </form>
      ),
    },
    {
      id: "redirects",
      label: "System URL Redirects Map",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Redirect Mapping</h3>
            <Button size="sm" className="flex items-center gap-1.5 rounded-none">
              <Plus className="w-3.5 h-3.5" /> New Redirect
            </Button>
          </div>
          <Table columns={redirectColumns} data={redirects} />
        </div>
      ),
    },
    {
      id: "site",
      label: "Concierge Contact & Theme Settings",
      content: (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 max-w-xl">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans mb-4">Contact Information</h3>
          <Input
            label="Concierge Phone Line"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Client Support Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans pt-4 mb-4">Visual Styling Preferences</h3>
          <Select
            label="Platform Base Palette"
            options={[
              { value: "luxury-gold", label: "Luxury Amber Gold" },
              { value: "monochrome", label: "Structural Monochrome" },
              { value: "nordic-slate", label: "Nordic Minimal Slate" },
            ]}
          />
          <Button className="flex items-center gap-1.5 rounded-none">
            <Save className="w-3.5 h-3.5" /> Save Site Preferences
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">
          Global Settings
        </h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Configure Platform Metadata, URL Routers, Theme Schemes, and Corporate Contact Details
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabContents} />
    </div>
  );
}
