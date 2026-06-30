"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, X } from "lucide-react";

// --- COCONUT BRANDING INITIAL DATA ---
const PRODUCTS_DATA = [
  { id: "1", title: "Extra Virgin Coconut Oil", sku: "SA-COCO-OIL-250", price: "₦15,000", stock: 50, category: "Organic Wellness" },
  { id: "2", title: "Organic Coconut Water", sku: "SA-COCO-WTR-330", price: "₦4,500", stock: 120, category: "Organic Wellness" },
  { id: "3", title: "Nourishing Coconut Body Butter", sku: "SA-COCO-BTR-200", price: "₦18,000", stock: 40, category: "Premium Skincare" },
];

const CATEGORIES_DATA = [
  { id: "1", name: "Organic Wellness", slug: "organic-wellness", count: 2 },
  { id: "2", name: "Premium Skincare", slug: "premium-skincare", count: 1 },
];

const COUPONS_DATA = [
  { id: "1", code: "AMNISVIP", discount: "20% OFF", type: "percentage", status: "active" },
  { id: "2", code: "COCO50", discount: "₦5,000 OFF", type: "fixed", status: "active" },
];

export default function AdminCatalogPage() {
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [coupons, setCoupons] = useState(COUPONS_DATA);

  // Forms Toggle State
  const [activeForm, setActiveForm] = useState<"product" | "category" | "coupon" | null>(null);

  // Form Inputs State
  const [prodTitle, setProdTitle] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("Organic Wellness");

  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");

  const [coupCode, setCoupCode] = useState("");
  const [coupDiscount, setCoupDiscount] = useState("");
  const [coupType, setCoupType] = useState("percentage");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd = {
      id: `${products.length + 1}`,
      title: prodTitle,
      sku: prodSku || `SA-NEW-${products.length + 1}`,
      price: `₦${Number(prodPrice).toLocaleString()}`,
      stock: Number(prodStock) || 0,
      category: prodCategory,
    };
    setProducts([...products, newProd]);
    setProdTitle("");
    setProdSku("");
    setProdPrice("");
    setProdStock("");
    setActiveForm(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat = {
      id: `${categories.length + 1}`,
      name: catName,
      slug: catSlug || catName.toLowerCase().replace(/\s+/g, "-"),
      count: 0,
    };
    setCategories([...categories, newCat]);
    setCatName("");
    setCatSlug("");
    setActiveForm(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoup = {
      id: `${coupons.length + 1}`,
      code: coupCode.toUpperCase(),
      discount: coupType === "percentage" ? `${coupDiscount}% OFF` : `₦${Number(coupDiscount).toLocaleString()} OFF`,
      type: coupType,
      status: "active",
    };
    setCoupons([...coupons, newCoup]);
    setCoupCode("");
    setCoupDiscount("");
    setActiveForm(null);
  };

  // Products Tab Columns
  const productsColumns = [
    { header: "Product Title", accessor: "title" as const },
    { header: "SKU", accessor: "sku" as const },
    { header: "Category", accessor: "category" as const },
    { header: "Price", accessor: "price" as const },
    {
      header: "Stock Status",
      accessor: (item: typeof PRODUCTS_DATA[0]) => (
        <span className={item.stock > 10 ? "text-green-500 font-semibold text-xs" : "text-amber-500 font-semibold text-xs"}>
          {item.stock} items
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (item: typeof PRODUCTS_DATA[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProducts(products.filter((p) => p.id !== item.id))}
            className="p-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  // Categories Tab Columns
  const categoriesColumns = [
    { header: "Category Name", accessor: "name" as const },
    { header: "Slug Path", accessor: "slug" as const },
    { header: "Total Products Linked", accessor: "count" as const },
    {
      header: "Actions",
      accessor: (item: typeof CATEGORIES_DATA[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCategories(categories.filter((c) => c.id !== item.id))}
            className="p-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  // Coupons Tab Columns
  const couponsColumns = [
    { header: "Coupon Code", accessor: "code" as const },
    { header: "Benefit", accessor: "discount" as const },
    { header: "Type", accessor: "type" as const },
    {
      header: "Status",
      accessor: (item: typeof COUPONS_DATA[0]) => (
        <Badge variant={item.status === "active" ? "success" : "destructive"}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (item: typeof COUPONS_DATA[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCoupons(coupons.filter((c) => c.id !== item.id))}
            className="p-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const tabContents = [
    {
      id: "products",
      label: "Products Catalog",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Products List</h3>
            <Button
              size="sm"
              onClick={() => setActiveForm("product")}
              className="flex items-center gap-1.5 rounded-none"
            >
              <Plus className="w-3.5 h-3.5" /> Add Product
            </Button>
          </div>
          <Table columns={productsColumns} data={products} />
        </div>
      ),
    },
    {
      id: "categories",
      label: "Categories & Collections",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Categories Directory</h3>
            <Button
              size="sm"
              onClick={() => setActiveForm("category")}
              className="flex items-center gap-1.5 rounded-none"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </Button>
          </div>
          <Table columns={categoriesColumns} data={categories} />
        </div>
      ),
    },
    {
      id: "coupons",
      label: "Discounts & Coupons",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Campaign Vouchers</h3>
            <Button
              size="sm"
              onClick={() => setActiveForm("coupon")}
              className="flex items-center gap-1.5 rounded-none"
            >
              <Plus className="w-3.5 h-3.5" /> Create Coupon
            </Button>
          </div>
          <Table columns={couponsColumns} data={coupons} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">
          Catalog Manager
        </h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Administer Products, Variant Specifications, and Discount Vouchers
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabContents} />

      {/* Dialog Modals Overlay */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center px-4 z-50">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveForm(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {activeForm === "product" && (
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <h3 className="font-serif text-lg text-white">Add Formulation Product</h3>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Pure Coconut Water"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="e.g. SA-COCO-WTR-330"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-400">Price (₦)</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="e.g. 4500"
                      className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-400">Initial Stock</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  >
                    <option value="Organic Wellness">Organic Wellness</option>
                    <option value="Premium Skincare">Premium Skincare</option>
                  </select>
                </div>
                <Button type="submit" className="w-full rounded-none mt-2">
                  Add Product
                </Button>
              </form>
            )}

            {activeForm === "category" && (
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <h3 className="font-serif text-lg text-white">Add Collection Category</h3>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Category Name</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Premium Skincare"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Slug Path</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="e.g. premium-skincare"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <Button type="submit" className="w-full rounded-none mt-2">
                  Add Category
                </Button>
              </form>
            )}

            {activeForm === "coupon" && (
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <h3 className="font-serif text-lg text-white">Create Campaign Voucher</h3>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={coupCode}
                    onChange={(e) => setCoupCode(e.target.value)}
                    placeholder="e.g. COCO50"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-400">Value</label>
                    <input
                      type="number"
                      required
                      value={coupDiscount}
                      onChange={(e) => setCoupDiscount(e.target.value)}
                      placeholder="e.g. 20"
                      className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-400">Discount Type</label>
                    <select
                      value={coupType}
                      onChange={(e) => setCoupType(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₦)</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-none mt-2">
                  Create Coupon
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
