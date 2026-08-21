"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@/components/ds/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table } from "@/components/ds/table";
import { useToast } from "@/hooks/useToast";
import { Save, Plus, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";
import { FEATURED_SLUGS } from "@/lib/catalog";

interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
}

interface HomepageProduct {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
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

  // ------------------------------------------------------------- Homepage
  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => api<{ products: HomepageProduct[] }>("/api/admin/products"),
  });
  const allProducts = (productsQuery.data?.products ?? []).filter((p) => p.isActive);

  const [featuredSlugs, setFeaturedSlugs] = useState<string[]>([]);
  const [productFilter, setProductFilter] = useState("");

  // Preselect the live default (catalog.ts's FEATURED_SLUGS) until the admin
  // has actually saved a choice, so the form reflects what the homepage
  // currently shows rather than opening empty.
  useEffect(() => {
    const s = settingsQuery.data?.settings;
    if (!s) return;
    const saved = s["featured-products"];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFeaturedSlugs(parsed);
          return;
        }
      } catch {
        // fall through to default below
      }
    }
    setFeaturedSlugs([...FEATURED_SLUGS]);
  }, [settingsQuery.data]);

  const featuredProducts = featuredSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean) as HomepageProduct[];

  const toggleFeatured = (slug: string) => {
    setFeaturedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const moveFeatured = (index: number, direction: -1 | 1) => {
    setFeaturedSlugs((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const visibleProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(productFilter.toLowerCase())
  );

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
      id: "homepage",
      label: "Homepage",
      content: (
        <div className="space-y-6 max-w-3xl">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans mb-4">
            Best sellers — the &quot;Start here&quot; grid on the homepage
          </h3>

          <div>
            <p className="text-xs font-semibold text-foreground mb-2">
              Selected, in display order ({featuredProducts.length})
            </p>
            {featuredProducts.length === 0 ? (
              <p className="text-[11px] text-muted-foreground border border-dashed border-border rounded-none p-4">
                Nothing selected — the homepage will show the first few active products instead.
              </p>
            ) : (
              <ul className="divide-y divide-border border border-border">
                {featuredProducts.map((product, i) => (
                  <li key={product.id} className="flex items-center gap-3 px-3 py-2">
                    <span className="text-[11px] text-muted-foreground w-5">{i + 1}</span>
                    <span className="flex-1 text-sm">{product.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      disabled={i === 0}
                      onClick={() => moveFeatured(i, -1)}
                      aria-label={`Move ${product.title} up`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      disabled={i === featuredProducts.length - 1}
                      onClick={() => moveFeatured(i, 1)}
                      aria-label={`Move ${product.title} down`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 text-destructive hover:bg-destructive/10"
                      onClick={() => toggleFeatured(product.slug)}
                      aria-label={`Remove ${product.title}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Input
              label="Add products"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              placeholder="Search by product name"
            />
            <ul className="mt-2 max-h-64 overflow-y-auto divide-y divide-border border border-border">
              {visibleProducts.length === 0 ? (
                <li className="px-3 py-3 text-[11px] text-muted-foreground">No products match.</li>
              ) : (
                visibleProducts.map((product) => {
                  const selected = featuredSlugs.includes(product.slug);
                  return (
                    <li key={product.id}>
                      <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleFeatured(product.slug)}
                          className="accent-foreground"
                        />
                        <span className="text-sm">{product.title}</span>
                      </label>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <Button
            type="button"
            loading={saveSettings.isPending}
            className="flex items-center gap-1.5 rounded-none"
            onClick={() => saveSettings.mutate({ "featured-products": JSON.stringify(featuredSlugs) })}
          >
            <Save className="w-3.5 h-3.5" /> Save
          </Button>
        </div>
      ),
    },
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
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans mb-4">
            Default meta tags — used where a page doesn&apos;t set its own
          </h3>
          <Input label="Default page title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Sana Amnis | Cold-Pressed Coconut Oil & Water" />
          <Input label="Default meta description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} placeholder="One or two sentences describing the store." />
          <Button type="submit" loading={saveSettings.isPending} className="flex items-center gap-1.5 rounded-none">
            <Save className="w-3.5 h-3.5" /> Save
          </Button>
          <p className="text-[11px] text-muted-foreground">
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
            className="flex flex-wrap items-end gap-3 bg-muted p-4 border border-border"
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
          <p className="text-[11px] text-muted-foreground">
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
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans mb-4">Contact Information</h3>
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
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground mb-2">Settings</h1>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider font-sans">
          SEO defaults, redirects and contact details
        </p>
      </div>

      <Tabs tabs={tabContents} />
    </div>
  );
}
