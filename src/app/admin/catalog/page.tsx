"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2 } from "lucide-react";

// --- MOCK DATA ---
const PRODUCTS_DATA = [
  { id: "1", title: "Amnis Cashmere Overcoat", sku: "AM-CASH-OCT", price: "₦185,000", stock: 12, category: "Coats" },
  { id: "2", title: "Linen Minimalist Kimono", sku: "AM-LIN-KMN", price: "₦95,000", stock: 8, category: "Outerwear" },
  { id: "3", title: "Silk Ribbed Turtleneck", sku: "AM-SLK-TTL", price: "₦68,000", stock: 15, category: "Knitwear" },
];

const CATEGORIES_DATA = [
  { id: "1", name: "Coats & Outerwear", slug: "coats", count: 14 },
  { id: "2", name: "Premium Knitwear", slug: "knitwear", count: 8 },
  { id: "3", name: "Essentials & Accessories", slug: "accessories", count: 21 },
];

const COUPONS_DATA = [
  { id: "1", code: "AMNISVIP", discount: "20% OFF", type: "percentage", status: "active" },
  { id: "2", code: "SUMMER50", discount: "₦50,000 OFF", type: "fixed", status: "expired" },
];

export default function AdminCatalogPage() {
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [coupons, setCoupons] = useState(COUPONS_DATA);

  // Products Tab
  const productsColumns = [
    { header: "Product Title", accessor: "title" as const },
    { header: "SKU", accessor: "sku" as const },
    { header: "Category", accessor: "category" as const },
    { header: "Price", accessor: "price" as const },
    {
      header: "Stock Status",
      accessor: (item: typeof PRODUCTS_DATA[0]) => (
        <span className={item.stock > 10 ? "text-green-500 font-semibold" : "text-amber-500 font-semibold"}>
          {item.stock} items
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (item: typeof PRODUCTS_DATA[0]) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="p-1 hover:bg-neutral-800">
            <Edit className="w-3.5 h-3.5" />
          </Button>
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

  // Categories Tab
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

  // Coupons Tab
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
            <Button size="sm" className="flex items-center gap-1.5 rounded-none">
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
            <Button size="sm" className="flex items-center gap-1.5 rounded-none">
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
            <Button size="sm" className="flex items-center gap-1.5 rounded-none">
              <Plus className="w-3.5 h-3.5" /> Create Coupon
            </Button>
          </div>
          <Table columns={couponsColumns} data={coupons} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10">
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
    </div>
  );
}
