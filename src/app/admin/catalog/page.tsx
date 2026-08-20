"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { MediaDropzone } from "@/components/cms/MediaDropzone";
import { Edit, Plus, Trash2, X, Archive, ArchiveRestore } from "lucide-react";

interface AdminVariant {
  id: string;
  sku: string;
  name: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  variants: AdminVariant[];
}

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
}

interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  expiresAt: string | null;
  isActive: boolean;
}

interface AdminBundleItem {
  variantId: string;
  quantity: number;
  variant: {
    sku: string;
    name: string;
    price: string;
    product: { title: string } | null;
  } | null;
}

interface AdminBundle {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  price: string;
  regularValue: string | null;
  badge: string | null;
  heroImageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  items: AdminBundleItem[];
}

const naira = (value: string | number) => `₦${Number(value).toLocaleString()}`;
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

export default function AdminCatalogPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [activeModal, setActiveModal] = useState<
    "add-product" | "edit-product" | "category" | "coupon" | "add-bundle" | "edit-bundle" | null
  >(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => api<{ products: AdminProduct[] }>("/api/admin/products"),
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api<{ categories: AdminCategory[] }>("/api/admin/categories"),
  });
  const couponsQuery = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => api<{ coupons: AdminCoupon[] }>("/api/admin/coupons"),
  });
  const bundlesQuery = useQuery({
    queryKey: ["admin", "bundles"],
    queryFn: () => api<{ bundles: AdminBundle[] }>("/api/admin/bundles"),
  });

  const products = productsQuery.data?.products ?? [];
  const categories = categoriesQuery.data?.categories ?? [];
  const coupons = couponsQuery.data?.coupons ?? [];
  const bundleList = bundlesQuery.data?.bundles ?? [];

  const invalidate = (key: string) => queryClient.invalidateQueries({ queryKey: ["admin", key] });

  // ---------------------------------------------------------------- Products
  const [prodTitle, setProdTitle] = useState("");
  const [prodSlug, setProdSlug] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState("");
  const [varSku, setVarSku] = useState("");
  const [varName, setVarName] = useState("");
  const [varPrice, setVarPrice] = useState("");
  const [varStock, setVarStock] = useState("50");
  const [varImageUrl, setVarImageUrl] = useState("");

  const resetProductForm = () => {
    setProdTitle("");
    setProdSlug("");
    setProdDescription("");
    setProdCategoryId(categories[0]?.id ?? "");
    setVarSku("");
    setVarName("Standard");
    setVarPrice("");
    setVarStock("50");
    setVarImageUrl("");
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    resetProductForm();
    setActiveModal("add-product");
  };

  const createProduct = useMutation({
    mutationFn: () =>
      api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          title: prodTitle,
          slug: prodSlug || prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          description: prodDescription || undefined,
          categoryId: prodCategoryId,
          variant: {
            sku: varSku,
            name: varName,
            price: Number(varPrice),
            stock: Number(varStock),
            imageUrl: varImageUrl || undefined,
          },
        }),
      }),
    onSuccess: () => {
      toast.success("Product created", `"${prodTitle}" is live on the storefront.`);
      invalidate("products");
      setActiveModal(null);
    },
    onError: (err: Error) => toast.error("Could not create product", err.message),
  });

  const updateProduct = useMutation({
    mutationFn: (input: { id: string; title: string; description: string; categoryId: string }) =>
      api(`/api/admin/products/${input.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: input.title,
          description: input.description || null,
          categoryId: input.categoryId,
        }),
      }),
    onSuccess: () => {
      toast.success("Product updated");
      invalidate("products");
      setActiveModal(null);
    },
    onError: (err: Error) => toast.error("Could not update product", err.message),
  });

  const toggleProductActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
    onSuccess: (_data, vars) => {
      toast.success(vars.isActive ? "Product restored" : "Product archived");
      invalidate("products");
    },
    onError: (err: Error) => toast.error("Could not update product", err.message),
  });

  // ------------------------------------------------------- Bulk selection
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const toggleProductRow = (id: string) => {
    setSelectedProductIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllProductRows = (ids: string[]) => {
    setSelectedProductIds((current) => {
      const allSelected = ids.length > 0 && ids.every((id) => current.has(id));
      if (allSelected) {
        const next = new Set(current);
        ids.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...current, ...ids]);
    });
  };

  const bulkDeleteProducts = useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            await api(`/api/admin/products/${id}`, { method: "DELETE" });
            return { id, ok: true as const };
          } catch (error) {
            return { id, ok: false as const, message: error instanceof Error ? error.message : "Failed" };
          }
        })
      );
      return results;
    },
    onSuccess: (results) => {
      const deleted = results.filter((r) => r.ok).length;
      const failed = results.filter((r) => !r.ok);
      invalidate("products");
      setSelectedProductIds(new Set());
      if (deleted > 0) toast.success(`Deleted ${deleted} product${deleted === 1 ? "" : "s"}`);
      if (failed.length > 0) {
        toast.error(
          `Could not delete ${failed.length} product${failed.length === 1 ? "" : "s"}`,
          failed[0].message
        );
      }
    },
    onError: (err: Error) => toast.error("Could not delete the selected products", err.message),
  });

  const openEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdDescription(product.description ?? "");
    setProdCategoryId(product.categoryId ?? "");
    setActiveModal("edit-product");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct.mutate({
        id: editingProduct.id,
        title: prodTitle,
        description: prodDescription,
        categoryId: prodCategoryId,
      });
    } else {
      createProduct.mutate();
    }
  };

  // ---------------------------------------------------------------- Variants
  const addVariant = useMutation({
    mutationFn: ({ productId, ...body }: { productId: string; sku: string; name: string; price: number; stock: number }) =>
      api(`/api/admin/products/${productId}/variants`, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success("Variant added");
      invalidate("products");
    },
    onError: (err: Error) => toast.error("Could not add variant", err.message),
  });

  const updateVariant = useMutation({
    mutationFn: ({ id, ...body }: { id: string; [key: string]: unknown }) =>
      api(`/api/admin/variants/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => {
      invalidate("products");
    },
    onError: (err: Error) => toast.error("Could not update variant", err.message),
  });

  const deleteVariant = useMutation({
    mutationFn: (id: string) => api(`/api/admin/variants/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Variant deleted");
      invalidate("products");
    },
    onError: (err: Error) => toast.error("Could not delete variant", err.message),
  });

  // -------------------------------------------------------------- Categories
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");

  const createCategory = useMutation({
    mutationFn: () =>
      api("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: catName, slug: catSlug || catName.toLowerCase().replace(/\s+/g, "-") }),
      }),
    onSuccess: () => {
      toast.success(`Created category "${catName}"`);
      invalidate("categories");
      setCatName("");
      setCatSlug("");
      setActiveModal(null);
    },
    onError: (err: Error) => toast.error("Could not create category", err.message),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api(`/api/admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Category removed");
      invalidate("categories");
      invalidate("products");
    },
    onError: (err: Error) => toast.error("Could not remove category", err.message),
  });

  // ----------------------------------------------------------------- Coupons
  const [coupCode, setCoupCode] = useState("");
  const [coupDiscount, setCoupDiscount] = useState("");
  const [coupType, setCoupType] = useState<"percentage" | "fixed">("percentage");

  const createCoupon = useMutation({
    mutationFn: () =>
      api("/api/admin/coupons", {
        method: "POST",
        body: JSON.stringify({
          code: coupCode,
          discountType: coupType,
          discountValue: Number(coupDiscount),
        }),
      }),
    onSuccess: () => {
      toast.success(`Created coupon "${coupCode.toUpperCase()}"`);
      invalidate("coupons");
      setCoupCode("");
      setCoupDiscount("");
      setActiveModal(null);
    },
    onError: (err: Error) => toast.error("Could not create coupon", err.message),
  });

  const toggleCoupon = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api(`/api/admin/coupons/${id}`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
    onSuccess: () => invalidate("coupons"),
    onError: (err: Error) => toast.error("Could not update coupon", err.message),
  });

  const deleteCoupon = useMutation({
    mutationFn: (id: string) => api(`/api/admin/coupons/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Coupon deleted");
      invalidate("coupons");
    },
    onError: (err: Error) => toast.error("Could not delete coupon", err.message),
  });

  // ----------------------------------------------------------------- Bundles
  const [editingBundle, setEditingBundle] = useState<AdminBundle | null>(null);
  const [bunTitle, setBunTitle] = useState("");
  const [bunSlug, setBunSlug] = useState("");
  const [bunTagline, setBunTagline] = useState("");
  const [bunDescription, setBunDescription] = useState("");
  const [bunPrice, setBunPrice] = useState("");
  const [bunRegularValue, setBunRegularValue] = useState("");
  const [bunBadge, setBunBadge] = useState("");
  const [bunHeroImage, setBunHeroImage] = useState("");
  const [bunPublished, setBunPublished] = useState(true);
  const [bunItems, setBunItems] = useState<Array<{ variantId: string; quantity: number }>>([]);

  const resetBundleForm = () => {
    setBunTitle("");
    setBunSlug("");
    setBunTagline("");
    setBunDescription("");
    setBunPrice("");
    setBunRegularValue("");
    setBunBadge("");
    setBunHeroImage("");
    setBunPublished(true);
    setBunItems([]);
  };

  const openAddBundle = () => {
    setEditingBundle(null);
    resetBundleForm();
    setActiveModal("add-bundle");
  };

  const openEditBundle = (bundle: AdminBundle) => {
    setEditingBundle(bundle);
    setBunTitle(bundle.title);
    setBunTagline(bundle.tagline ?? "");
    setBunDescription(bundle.description ?? "");
    setBunPrice(bundle.price);
    setBunRegularValue(bundle.regularValue ?? "");
    setBunBadge(bundle.badge ?? "");
    setBunHeroImage(bundle.heroImageUrl ?? "");
    setBunPublished(bundle.isPublished);
    setBunItems(bundle.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })));
    setActiveModal("edit-bundle");
  };

  const saveBundle = useMutation({
    mutationFn: () => {
      const body = {
        title: bunTitle,
        tagline: bunTagline || undefined,
        description: bunDescription || undefined,
        price: Number(bunPrice),
        regularValue: bunRegularValue ? Number(bunRegularValue) : undefined,
        badge: bunBadge || undefined,
        heroImageUrl: bunHeroImage || undefined,
        isPublished: bunPublished,
        items: bunItems,
      };
      return editingBundle
        ? api(`/api/admin/bundles/${editingBundle.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : api("/api/admin/bundles", {
            method: "POST",
            body: JSON.stringify({ ...body, slug: bunSlug || slugify(bunTitle) }),
          });
    },
    onSuccess: () => {
      toast.success(editingBundle ? "Bundle updated" : "Bundle published");
      invalidate("bundles");
      setActiveModal(null);
    },
    onError: (err: Error) => toast.error("Could not save bundle", err.message),
  });

  const deleteBundle = useMutation({
    mutationFn: (id: string) => api(`/api/admin/bundles/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Bundle deleted");
      invalidate("bundles");
    },
    onError: (err: Error) => toast.error("Could not delete bundle", err.message),
  });

  // -------------------------------------------------------------- Table defs
  const productColumns = [
    {
      header: "Product",
      accessor: (item: AdminProduct) => (
        <button
          type="button"
          onClick={() => openEditProduct(item)}
          className="flex items-center gap-3 py-1 text-left cursor-pointer group/item"
        >
          <div className="relative w-10 h-10 bg-card border border-border rounded-lg overflow-hidden shrink-0 group-hover/item:border-primary transition-colors">
            {item.variants[0]?.imageUrl && (
              <Image src={item.variants[0].imageUrl} alt="" fill sizes="40px" className="object-cover" />
            )}
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
              {item.title}
            </h4>
            <span className="text-[10px] text-muted-foreground font-sans block">
              {item.variants.length} {item.variants.length === 1 ? "variant" : "variants"}
            </span>
          </div>
        </button>
      ),
    },
    { header: "Category", accessor: (item: AdminProduct) => item.category?.name ?? "—" },
    {
      header: "Price range",
      accessor: (item: AdminProduct) => {
        const prices = item.variants.map((v) => Number(v.price));
        if (prices.length === 0) return "—";
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return <span className="font-serif font-semibold text-foreground">{min === max ? naira(min) : `${naira(min)}–${naira(max)}`}</span>;
      },
    },
    {
      header: "Stock",
      accessor: (item: AdminProduct) => {
        const total = item.variants.reduce((sum, v) => sum + v.stock, 0);
        return (
          <span className={total > 10 ? "text-emerald-400 font-semibold text-xs" : "text-amber-400 font-semibold text-xs"}>
            {total} units
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: (item: AdminProduct) => <Badge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "Live" : "Archived"}</Badge>,
    },
    {
      header: "Actions",
      accessor: (item: AdminProduct) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEditProduct(item)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted" title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleProductActive.mutate({ id: item.id, isActive: !item.isActive })}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
            title={item.isActive ? "Archive" : "Restore"}
          >
            {item.isActive ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
          </Button>
        </div>
      ),
    },
  ];

  const categoryColumns = [
    { header: "Category", accessor: "name" as const },
    { header: "Slug", accessor: "slug" as const },
    { header: "Products", accessor: "productCount" as const },
    {
      header: "Actions",
      accessor: (item: AdminCategory) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (item.productCount > 0 && !confirm(`"${item.name}" has ${item.productCount} product(s), which will become uncategorised. Continue?`)) return;
            deleteCategory.mutate(item.id);
          }}
          className="p-2 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const couponColumns = [
    { header: "Code", accessor: "code" as const },
    {
      header: "Discount",
      accessor: (item: AdminCoupon) => (item.discountType === "percentage" ? `${Number(item.discountValue)}%` : naira(item.discountValue)),
    },
    { header: "Expires", accessor: (item: AdminCoupon) => (item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "Never") },
    {
      header: "Status",
      accessor: (item: AdminCoupon) => (
        <button onClick={() => toggleCoupon.mutate({ id: item.id, isActive: !item.isActive })} className="cursor-pointer">
          <Badge variant={item.isActive ? "success" : "destructive"}>{item.isActive ? "active" : "disabled"}</Badge>
        </button>
      ),
    },
    {
      header: "Actions",
      accessor: (item: AdminCoupon) => (
        <Button variant="ghost" size="sm" onClick={() => deleteCoupon.mutate(item.id)} className="p-2 text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const bundleColumns = [
    {
      header: "Bundle",
      accessor: (item: AdminBundle) => (
        <button onClick={() => openEditBundle(item)} className="flex items-center gap-3 text-left cursor-pointer">
          <div className="relative w-10 h-10 bg-card border border-border rounded-lg overflow-hidden shrink-0">
            {item.heroImageUrl && <Image src={item.heroImageUrl} alt="" fill sizes="40px" className="object-cover" />}
          </div>
          <div>
            <span className="font-serif text-sm font-semibold text-foreground block">{item.title}</span>
            <span className="text-[10px] text-muted-foreground">/bundles/{item.slug} · {item.items.length} items</span>
          </div>
        </button>
      ),
    },
    { header: "Price", accessor: (item: AdminBundle) => <span className="font-serif font-semibold text-foreground">{naira(item.price)}</span> },
    {
      header: "Regular value",
      accessor: (item: AdminBundle) => (item.regularValue ? naira(item.regularValue) : "—"),
    },
    { header: "Status", accessor: (item: AdminBundle) => <Badge variant={item.isPublished ? "success" : "secondary"}>{item.isPublished ? "Published" : "Draft"}</Badge> },
    {
      header: "Actions",
      accessor: (item: AdminBundle) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEditBundle(item)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted" title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => confirm(`Delete "${item.title}"?`) && deleteBundle.mutate(item.id)}
            className="p-2 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const tabContents = [
    {
      id: "products",
      label: "Products",
      content: (
        <div className="space-y-6">
          {selectedProductIds.size > 0 ? (
            <div className="flex justify-between items-center bg-primary/5 p-4 border border-primary/30">
              <h3 className="text-xs uppercase tracking-widest text-foreground font-bold font-sans">
                {selectedProductIds.size} selected
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProductIds(new Set())}
                  className="rounded-none border-border text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  loading={bulkDeleteProducts.isPending}
                  onClick={() => {
                    const count = selectedProductIds.size;
                    if (!confirm(`Delete ${count} product${count === 1 ? "" : "s"}? This can't be undone. Products with order history will be skipped.`)) return;
                    bulkDeleteProducts.mutate([...selectedProductIds]);
                  }}
                  className="flex items-center gap-1.5 rounded-none text-destructive hover:bg-destructive/10 font-semibold text-xs uppercase tracking-wider px-4 py-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete selected
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-muted p-4 border border-border">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
                Products ({products.length})
              </h3>
              <Button size="sm" onClick={openAddProduct} className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
          )}
          <Table
            columns={productColumns}
            data={products}
            loading={productsQuery.isLoading}
            getRowId={(item: AdminProduct) => item.id}
            selectedIds={selectedProductIds}
            onToggleRow={toggleProductRow}
            onToggleAll={toggleAllProductRows}
          />
        </div>
      ),
    },
    {
      id: "categories",
      label: "Categories",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-muted p-4 border border-border">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
              Categories ({categories.length})
            </h3>
            <Button size="sm" onClick={() => setActiveModal("category")} className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          </div>
          <Table columns={categoryColumns} data={categories} loading={categoriesQuery.isLoading} />
        </div>
      ),
    },
    {
      id: "coupons",
      label: "Coupons",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-muted p-4 border border-border">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
                Coupons ({coupons.length})
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Codes are stored and validated only — checkout doesn&apos;t apply a discount from them yet.
              </p>
            </div>
            <Button size="sm" onClick={() => setActiveModal("coupon")} className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
              <Plus className="w-4 h-4" /> Create Coupon
            </Button>
          </div>
          <Table columns={couponColumns} data={coupons} loading={couponsQuery.isLoading} />
        </div>
      ),
    },
    {
      id: "bundles",
      label: "Bundles",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-muted p-4 border border-border">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold font-sans">
              Bundles ({bundleList.length})
            </h3>
            <Button size="sm" onClick={openAddBundle} className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
              <Plus className="w-4 h-4" /> Add Bundle
            </Button>
          </div>
          <Table columns={bundleColumns} data={bundleList} loading={bundlesQuery.isLoading} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 relative">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground mb-2">Catalog</h1>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider font-sans">
          Products, categories and coupons — changes apply to the live storefront immediately.
        </p>
      </div>

      <Tabs tabs={tabContents} />

      {/* Product Add/Edit Modal */}
      {(activeModal === "add-product" || activeModal === "edit-product") && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50 overflow-y-auto py-10">
          <div className="max-w-2xl w-full bg-card border border-border p-8 shadow-2xl space-y-6 relative my-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-border pb-4">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              <Input label="Product Title" required value={prodTitle} onChange={(e) => setProdTitle(e.target.value)} placeholder="e.g. Extra Virgin Coconut Oil" />

              {!editingProduct && (
                <Input label="Slug (optional — generated from title)" value={prodSlug} onChange={(e) => setProdSlug(e.target.value)} placeholder="e.g. extra-virgin-coconut-oil" />
              )}

              <Select
                label="Category"
                required
                value={prodCategoryId}
                onChange={(e) => setProdCategoryId(e.target.value)}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block">Description</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="What is this, and what makes it worth buying?"
                  className="w-full bg-background border border-border p-3 text-xs text-foreground outline-none focus:border-primary resize-none"
                />
              </div>

              {!editingProduct && (
                <div className="pt-4 border-t border-border space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block">
                    First variant
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="SKU" required value={varSku} onChange={(e) => setVarSku(e.target.value)} placeholder="e.g. SA-OIL-500" />
                    <Input label="Variant name" required value={varName} onChange={(e) => setVarName(e.target.value)} placeholder="e.g. 500ml Bottle" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Price (₦)" type="number" required min={1} value={varPrice} onChange={(e) => setVarPrice(e.target.value)} />
                    <Input label="Stock" type="number" required min={0} value={varStock} onChange={(e) => setVarStock(e.target.value)} />
                  </div>
                  <Input label="Image URL (optional)" value={varImageUrl} onChange={(e) => setVarImageUrl(e.target.value)} placeholder="/products/… or https://…" />
                </div>
              )}

              {editingProduct && (
                <VariantsEditor
                  product={editingProduct}
                  onAdd={(v) => addVariant.mutate({ productId: editingProduct.id, ...v })}
                  onUpdate={(id, patch) => updateVariant.mutate({ id, ...patch })}
                  onDelete={(id) => {
                    if (confirm("Delete this variant? This can't be undone.")) deleteVariant.mutate(id);
                  }}
                />
              )}

              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1 rounded-none border-border text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
                <Button type="submit" loading={createProduct.isPending || updateProduct.isPending} className="flex-1 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-wider">
                  {editingProduct ? "Save Changes" : "Publish Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {activeModal === "category" && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50">
          <div className="max-w-md w-full bg-card border border-border p-8 shadow-2xl space-y-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCategory.mutate();
              }}
              className="space-y-4"
            >
              <h3 className="font-serif text-lg text-foreground">Add Category</h3>
              <Input label="Category Name" required value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Skin & Body" />
              <Input label="Slug (optional)" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="e.g. skin-body" />
              <Button type="submit" loading={createCategory.isPending} className="w-full rounded-none mt-2">
                Add Category
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {activeModal === "coupon" && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50">
          <div className="max-w-md w-full bg-card border border-border p-8 shadow-2xl space-y-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCoupon.mutate();
              }}
              className="space-y-4"
            >
              <h3 className="font-serif text-lg text-foreground">Create Coupon</h3>
              <Input label="Coupon Code" required value={coupCode} onChange={(e) => setCoupCode(e.target.value.toUpperCase())} placeholder="e.g. COCO50" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Value" type="number" required value={coupDiscount} onChange={(e) => setCoupDiscount(e.target.value)} placeholder="e.g. 20" />
                <Select
                  label="Type"
                  value={coupType}
                  onChange={(e) => setCoupType(e.target.value as "percentage" | "fixed")}
                  options={[
                    { value: "percentage", label: "Percentage (%)" },
                    { value: "fixed", label: "Fixed Amount (₦)" },
                  ]}
                />
              </div>
              <Button type="submit" loading={createCoupon.isPending} className="w-full rounded-none mt-2">
                Create Coupon
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Bundle Modal */}
      {(activeModal === "add-bundle" || activeModal === "edit-bundle") && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50 overflow-y-auto py-10">
          <div className="max-w-2xl w-full bg-card border border-border p-8 shadow-2xl space-y-6 relative my-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-border pb-4">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {editingBundle ? "Edit Bundle" : "Add New Bundle"}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (bunItems.length === 0) {
                  toast.error("Add at least one item to the bundle");
                  return;
                }
                saveBundle.mutate();
              }}
              className="space-y-5"
            >
              <Input label="Bundle Title" required value={bunTitle} onChange={(e) => setBunTitle(e.target.value)} placeholder="e.g. Rice Don Set! Coconut Rice Bundle" />

              {!editingBundle && (
                <Input label="Slug (optional — generated from title)" value={bunSlug} onChange={(e) => setBunSlug(e.target.value)} placeholder={slugify(bunTitle) || "e.g. rice-don-set"} />
              )}

              <Input label="Tagline" value={bunTagline} onChange={(e) => setBunTagline(e.target.value)} placeholder="One sentence for the carousel card" />

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block">Description</label>
                <textarea
                  rows={4}
                  value={bunDescription}
                  onChange={(e) => setBunDescription(e.target.value)}
                  placeholder="Why this bundle, and how to enjoy it — blank line between paragraphs"
                  className="w-full bg-background border border-border p-3 text-xs text-foreground outline-none focus:border-primary resize-y"
                />
              </div>

              <MediaDropzone label="Hero image" value={bunHeroImage} onChange={setBunHeroImage} accept="image/jpeg,image/png,image/webp,image/avif" />

              <div className="grid grid-cols-3 gap-4">
                <Input label="Bundle price (₦)" type="number" required min={1} value={bunPrice} onChange={(e) => setBunPrice(e.target.value)} />
                <Input label="Regular value (₦, optional)" type="number" min={1} value={bunRegularValue} onChange={(e) => setBunRegularValue(e.target.value)} placeholder="Sum of parts" />
                <Input label="Badge (optional)" value={bunBadge} onChange={(e) => setBunBadge(e.target.value)} placeholder="e.g. SAVE ₦2,500" />
              </div>

              <BundleItemsEditor products={products} items={bunItems} onChange={setBunItems} />

              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={bunPublished} onChange={(e) => setBunPublished(e.target.checked)} />
                Published (unchecked hides it from the storefront)
              </label>

              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1 rounded-none border-border text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
                <Button type="submit" loading={saveBundle.isPending} className="flex-1 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-wider">
                  {editingBundle ? "Save Changes" : "Publish Bundle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function VariantsEditor({
  product,
  onAdd,
  onUpdate,
  onDelete,
}: {
  product: AdminProduct;
  onAdd: (v: { sku: string; name: string; price: number; stock: number }) => void;
  onUpdate: (id: string, patch: { price?: number; stock?: number; isActive?: boolean }) => void;
  onDelete: (id: string) => void;
}) {
  const [newSku, setNewSku] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("0");

  return (
    <div className="pt-4 border-t border-border space-y-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block">
        Variants ({product.variants.length})
      </span>

      <div className="space-y-2">
        {product.variants.map((v) => (
          <div key={v.id} className="flex items-center gap-2 bg-background border border-border p-2.5">
            <span className="text-[10px] text-muted-foreground font-mono w-24 shrink-0 truncate">{v.sku}</span>
            <span className="text-xs text-foreground flex-1 truncate">{v.name}</span>
            <input
              type="number"
              defaultValue={v.price}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (n > 0 && n !== Number(v.price)) onUpdate(v.id, { price: n });
              }}
              className="w-24 bg-card border border-border px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
            />
            <input
              type="number"
              defaultValue={v.stock}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (n >= 0 && n !== v.stock) onUpdate(v.id, { stock: n });
              }}
              className="w-16 bg-card border border-border px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => onUpdate(v.id, { isActive: !v.isActive })}
              className="shrink-0"
              title={v.isActive ? "Archive variant" : "Restore variant"}
            >
              <Badge variant={v.isActive ? "success" : "secondary"} size="sm">
                {v.isActive ? "live" : "archived"}
              </Badge>
            </button>
            <button type="button" onClick={() => onDelete(v.id)} className="p-1 text-destructive hover:bg-destructive/10 shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input value={newSku} onChange={(e) => setNewSku(e.target.value)} placeholder="SKU" className="w-24 bg-background border border-border px-2 py-2 text-xs text-foreground outline-none focus:border-primary" />
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" className="flex-1 bg-background border border-border px-2 py-2 text-xs text-foreground outline-none focus:border-primary" />
        <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} type="number" placeholder="Price" className="w-24 bg-background border border-border px-2 py-2 text-xs text-foreground outline-none focus:border-primary" />
        <input value={newStock} onChange={(e) => setNewStock(e.target.value)} type="number" placeholder="Stock" className="w-16 bg-background border border-border px-2 py-2 text-xs text-foreground outline-none focus:border-primary" />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (!newSku || !newName || Number(newPrice) <= 0) return;
            onAdd({ sku: newSku, name: newName, price: Number(newPrice), stock: Number(newStock) || 0 });
            setNewSku("");
            setNewName("");
            setNewPrice("");
            setNewStock("0");
          }}
          className="rounded-none shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Fully client-side until the bundle is saved — unlike VariantsEditor, a
 * bundle's items are a small fixed set edited as one array in the same PATCH
 * as everything else, not independently priced/stocked resources of their own.
 */
function BundleItemsEditor({
  products,
  items,
  onChange,
}: {
  products: AdminProduct[];
  items: Array<{ variantId: string; quantity: number }>;
  onChange: (items: Array<{ variantId: string; quantity: number }>) => void;
}) {
  const [newVariantId, setNewVariantId] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");

  const variantOptions = products.flatMap((p) =>
    p.variants.map((v) => ({ value: v.id, label: `${p.title} — ${v.name} (${v.sku})` }))
  );

  const findVariantLabel = (variantId: string) => {
    for (const p of products) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) return { productTitle: p.title, variantName: v.name, sku: v.sku, price: v.price };
    }
    return null;
  };

  return (
    <div className="pt-4 border-t border-border space-y-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block">
        Bundle contents ({items.length})
      </span>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const info = findVariantLabel(item.variantId);
          return (
            <div key={`${item.variantId}-${idx}`} className="flex items-center gap-2 bg-background border border-border p-2.5">
              <span className="text-xs text-foreground flex-1 truncate">
                {info ? `${info.productTitle} — ${info.variantName}` : item.variantId}
              </span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const quantity = Math.max(1, Number(e.target.value) || 1);
                  onChange(items.map((i, j) => (j === idx ? { ...i, quantity } : i)));
                }}
                className="w-16 bg-card border border-border px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== idx))}
                className="p-1 text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground py-2">No items yet — add at least one below.</p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <select
          value={newVariantId}
          onChange={(e) => setNewVariantId(e.target.value)}
          className="flex-1 bg-background border border-border px-2 py-2 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
        >
          <option value="">Choose a product variant…</option>
          {variantOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          className="w-16 bg-background border border-border px-2 py-2 text-xs text-foreground outline-none focus:border-primary"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (!newVariantId) return;
            const quantity = Math.max(1, Number(newQuantity) || 1);
            onChange([...items, { variantId: newVariantId, quantity }]);
            setNewVariantId("");
            setNewQuantity("1");
          }}
          className="rounded-none shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
