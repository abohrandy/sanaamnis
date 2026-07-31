"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@/components/ds/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table } from "@/components/ds/table";
import { useToast } from "@/hooks/useToast";
import { Save, Plus, Trash2 } from "lucide-react";

interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

export default function AdminSettingsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => api<{ settings: Record<string, string> }>("/api/admin/settings"),
  });

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Populate the form once the real settings load — previously these fields
  // were hardcoded starting values ("Timeless garments designed with
  // architectural precision.") that had nothing to do with this store and
  // never saved anywhere when "Save" was pressed.
  useEffect(() => {
    const s = settingsQuery.data?.settings;
    if (!s) return;
    setSeoTitle(s["seo-title"] ?? "");
    setSeoDesc(s["seo-description"] ?? "");
    setContactEmail(s["contact-email"] ?? "");
    setContactPhone(s["contact-phone"] ?? "");
  }, [settingsQuery.data]);

  const saveSettings = useMutation({
    mutationFn: (patch: Record<string, string>) => api("/api/admin/settings", { method: "PATCH", body: JSON.stringify(patch) }),
    onSuccess: () => {
      toast.success("Saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: Error) => toast.error("Could not save", err.message),
  });

  // ------------------------------------------------------------- Redirects
  const redirectsQuery = useQuery({
    queryKey: ["admin", "redirects"],
    queryFn: () => api<{ redirects: RedirectRule[] }>("/api/admin/redirects"),
  });
  const redirects = redirectsQuery.data?.redirects ?? [];

  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);

  const createRedirect = useMutation({
    mutationFn: () => api("/api/admin/redirects", { method: "POST", body: JSON.stringify({ fromPath, toPath, statusCode }) }),
    onSuccess: () => {
      toast.success("Redirect added");
      queryClient.invalidateQueries({ queryKey: ["admin", "redirects"] });
      setFromPath("");
      setToPath("");
    },
    onError: (err: Error) => toast.error("Could not add redirect", err.message),
  });

  const deleteRedirect = useMutation({
    mutationFn: (id: string) => api(`/api/admin/redirects/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Redirect removed");
      queryClient.invalidateQueries({ queryKey: ["admin", "redirects"] });
    },
    onError: (err: Error) => toast.error("Could not remove redirect", err.message),
  });

  const redirectColumns = [
    { header: "From", accessor: "fromPath" as const },
    { header: "To", accessor: "toPath" as const },
    { header: "Type", accessor: (item: RedirectRule) => `${item.statusCode} ${item.statusCode === 301 ? "(permanent)" : "(temporary)"}` },
    {
      header: "Actions",
      accessor: (item: RedirectRule) => (
        <Button variant="ghost" size="sm" onClick={() => deleteRedirect.mutate(item.id)} className="p-1 text-destructive hover:bg-destructive/10">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  const tabContents = [
    {
      id: "seo",
      label: "SEO",
      content: (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSettings.mutate({ "seo-title": seoTitle, "seo-description": seoDesc });
          }}
          className="space-y-6 max-w-xl"
        >
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans mb-4">
            Default meta tags — used where a page doesn&apos;t set its own
          </h3>
          <Input label="Default page title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Sana Amnis | Cold-Pressed Coconut Oil & Water" />
          <Input label="Default meta description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} placeholder="One or two sentences describing the store." />
          <Button type="submit" loading={saveSettings.isPending} className="flex items-center gap-1.5 rounded-none">
            <Save className="w-3.5 h-3.5" /> Save
          </Button>
          <p className="text-[11px] text-neutral-500">
            Stored for reference; each page currently sets its own title and description in code, so this isn&apos;t read by the site yet.
          </p>
        </form>
      ),
    },
    {
      id: "redirects",
      label: "Redirects",
      content: (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createRedirect.mutate();
            }}
            className="flex flex-wrap items-end gap-3 bg-neutral-900/60 p-4 border border-neutral-800"
          >
            <div className="w-40">
              <Input label="From path" required value={fromPath} onChange={(e) => setFromPath(e.target.value)} placeholder="/old-page" />
            </div>
            <div className="w-52">
              <Input label="Redirects to" required value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="/new-page" />
            </div>
            <div className="w-36">
              <Select
                label="Type"
                value={String(statusCode)}
                onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)}
                options={[
                  { value: "301", label: "301 Permanent" },
                  { value: "302", label: "302 Temporary" },
                ]}
              />
            </div>
            <Button type="submit" loading={createRedirect.isPending} className="flex items-center gap-1.5 rounded-none h-[52px]">
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </form>
          <p className="text-[11px] text-neutral-500">
            Stored here for reference; nothing currently reads this table to actually redirect a visitor — that would be a small follow-up if you want it enforced.
          </p>
          <Table columns={redirectColumns} data={redirects} loading={redirectsQuery.isLoading} />
        </div>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      content: (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSettings.mutate({ "contact-email": contactEmail, "contact-phone": contactPhone });
          }}
          className="space-y-6 max-w-xl"
        >
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans mb-4">Contact Information</h3>
          <Input label="Support email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          <Input label="Support phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          <Button type="submit" loading={saveSettings.isPending} className="flex items-center gap-1.5 rounded-none">
            <Save className="w-3.5 h-3.5" /> Save
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          SEO defaults, redirects and contact details
        </p>
      </div>

      <Tabs tabs={tabContents} />
    </div>
  );
}
