"use client";

import React, { useState, useEffect } from "react";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, X, Image as ImageIcon, CheckCircle } from "lucide-react";

// Initial Seed Data with Product Images from Google Drive
const INITIAL_PRODUCTS = [
  {
    id: "1",
    title: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    sku: "SA-COCO-OIL-250",
    price: "15000",
    stock: 50,
    category: "Organic Wellness",
    imageUrl: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1000",
    description: "Cold-pressed organic extra virgin coconut oil for pure hair, skin, and culinary nourishment.",
  },
  {
    id: "2",
    title: "Sana Amnis Coconut Water",
    slug: "sana-amnis-coconut-water",
    sku: "SA-COCO-WTR-330",
    price: "4500",
    stock: 120,
    category: "Organic Wellness",
    imageUrl: "https://drive.google.com/thumbnail?id=1Z9Yf9iquA-YUp0eGmrcM7xr411520Qgp&sz=w1000",
    description: "100% natural bio-active coconut water packed with natural electrolytes.",
  },
  {
    id: "3",
    title: "Pure Coconut Milk Powder",
    slug: "pure-coconut-milk-powder",
    sku: "SA-MILK-PWD-250",
    price: "8500",
    stock: 80,
    category: "Organic Wellness",
    imageUrl: "https://drive.google.com/thumbnail?id=11VjXF_JnUyd9JX6FIqcfMSkF4D5POY4M&sz=w1000",
    description: "Spray-dried premium coconut milk powder from raw organic coconuts.",
  },
  {
    id: "4",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    sku: "SA-COCO-BTR-200",
    price: "18000",
    stock: 40,
    category: "Premium Skincare",
    imageUrl: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w1000",
    description: "Rich restorative body butter infused with raw coconut extract and botanical shea butter.",
  },
  {
    id: "5",
    title: "Restorative Coconut Hair Mask",
    slug: "restorative-coconut-hair-mask",
    sku: "SA-HAIR-MSK-250",
    price: "14000",
    stock: 35,
    category: "Hair & Body",
    imageUrl: "https://drive.google.com/thumbnail?id=1--CLF51noixdnvV8HhLmosvtP75RDlRE&sz=w1000",
    description: "Intensive deep conditioning treatment enriched with raw coconut oil.",
  },
  {
    id: "6",
    title: "Exfoliating Coconut Sugar Scrub",
    slug: "coconut-sugar-scrub",
    sku: "SA-SGR-SCR-200",
    price: "12500",
    stock: 45,
    category: "Premium Skincare",
    imageUrl: "https://drive.google.com/thumbnail?id=1kfVkQ-lqEpTKfvtl_WT-zwa28NeEOO1n&sz=w1000",
    description: "Gentle exfoliating body polish combining organic coconut sugar crystals with virgin coconut oil.",
  },
  {
    id: "7",
    title: "Toasted Organic Coconut Chips",
    slug: "organic-coconut-chips",
    sku: "SA-CHIP-SNK-100",
    price: "3500",
    stock: 100,
    category: "Gourmet Snacks",
    imageUrl: "https://drive.google.com/thumbnail?id=16WhogTSxDzbjaVewUFprCCPbN_mfhPxg&sz=w1000",
    description: "Crispy, golden-toasted coconut flakes lightly seasoned with sea salt.",
  },
  {
    id: "8",
    title: "Raw Organic Coconut Flour",
    slug: "raw-coconut-flour",
    sku: "SA-COCO-FLR-500",
    price: "6000",
    stock: 75,
    category: "Culinary Essentials",
    imageUrl: "https://drive.google.com/thumbnail?id=1hk33UKAflm0EIoFg_sGRzbQ3jSZsPLUp&sz=w1000",
    description: "High-fiber, gluten-free baking flour finely ground from organic coconut meat.",
  },
];

const INITIAL_CATEGORIES = [
  { id: "1", name: "Organic Wellness", slug: "organic-wellness", count: 2, imageUrl: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1000" },
  { id: "2", name: "Premium Skincare", slug: "premium-skincare", count: 1, imageUrl: "https://drive.google.com/thumbnail?id=11VjXF_JnUyd9JX6FIqcfMSkF4D5POY4M&sz=w1000" },
];

const INITIAL_COUPONS = [
  { id: "1", code: "AMNISVIP", discount: "20% OFF", type: "percentage", status: "active" },
  { id: "2", code: "COCO50", discount: "₦5,000 OFF", type: "fixed", status: "active" },
];

const SAMPLE_IMAGES = [
  { label: "Coconut Oil", url: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1000" },
  { label: "Coconut Water", url: "https://drive.google.com/thumbnail?id=19MfciPsk515kPomAxziUo3PT_x_-y6K_&sz=w1000" },
  { label: "Body Butter", url: "https://drive.google.com/thumbnail?id=11VjXF_JnUyd9JX6FIqcfMSkF4D5POY4M&sz=w1000" },
  { label: "Pure Coconut Milk", url: "https://drive.google.com/thumbnail?id=1Z9Yf9iquA-YUp0eGmrcM7xr411520Qgp&sz=w1000" },
  { label: "Hair Mask", url: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w1000" },
  { label: "Coconut Scrub", url: "https://drive.google.com/thumbnail?id=1--CLF51noixdnvV8HhLmosvtP75RDlRE&sz=w1000" },
];

export default function AdminCatalogPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [toastMessage, setToastMessage] = useState("");

  // Modal State
  const [activeModal, setActiveModal] = useState<"add-product" | "edit-product" | "category" | "coupon" | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form Fields
  const [prodTitle, setProdTitle] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("Organic Wellness");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodDescription, setProdDescription] = useState("");

  // Category Form Fields
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");

  // Coupon Form Fields
  const [coupCode, setCoupCode] = useState("");
  const [coupDiscount, setCoupDiscount] = useState("");
  const [coupType, setCoupType] = useState("percentage");

  // Load saved catalog items from localStorage on client mount if available
  useEffect(() => {
    try {
      const savedProds = localStorage.getItem("sana_amnis_admin_products");
      if (savedProds) setProducts(JSON.parse(savedProds));

      const savedCats = localStorage.getItem("sana_amnis_admin_categories");
      if (savedCats) setCategories(JSON.parse(savedCats));

      const savedCoups = localStorage.getItem("sana_amnis_admin_coupons");
      if (savedCoups) setCoupons(JSON.parse(savedCoups));
    } catch (err) {
      console.warn("Could not read stored catalog from local storage:", err);
    }
  }, []);

  const saveProductsState = (updated: typeof products) => {
    setProducts(updated);
    try {
      localStorage.setItem("sana_amnis_admin_products", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Open Product Modal for Edit
  const handleOpenEditProduct = (prod: (typeof products)[0]) => {
    setEditingProductId(prod.id);
    setProdTitle(prod.title);
    setProdSku(prod.sku);
    setProdPrice(prod.price);
    setProdStock(String(prod.stock));
    setProdCategory(prod.category);
    setProdImageUrl(prod.imageUrl);
    setProdDescription(prod.description || "");
    setActiveModal("edit-product");
  };

  // Open Product Modal for New Addition
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdTitle("");
    setProdSku("");
    setProdPrice("");
    setProdStock("50");
    setProdCategory("Organic Wellness");
    setProdImageUrl(SAMPLE_IMAGES[0].url);
    setProdDescription("");
    setActiveModal("add-product");
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeModal === "edit-product" && editingProductId) {
      const updated = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            title: prodTitle,
            sku: prodSku,
            price: prodPrice,
            stock: Number(prodStock) || 0,
            category: prodCategory,
            imageUrl: prodImageUrl || SAMPLE_IMAGES[0].url,
            description: prodDescription,
          };
        }
        return p;
      });
      saveProductsState(updated);
      showToast(`Updated "${prodTitle}" successfully!`);
    } else {
      const slug = prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const newProd = {
        id: `${Date.now()}`,
        title: prodTitle,
        slug: slug || `product-${Date.now()}`,
        sku: prodSku || `SA-PROD-${products.length + 1}`,
        price: prodPrice,
        stock: Number(prodStock) || 0,
        category: prodCategory,
        imageUrl: prodImageUrl || SAMPLE_IMAGES[0].url,
        description: prodDescription || "Organic premium formulation.",
      };
      saveProductsState([newProd, ...products]);
      showToast(`Created new product "${prodTitle}"!`);
    }

    setActiveModal(null);
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProductsState(updated);
      showToast(`Deleted "${title}"`);
    }
  };

  // Category Actions
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat = {
      id: `${Date.now()}`,
      name: catName,
      slug: catSlug || catName.toLowerCase().replace(/\s+/g, "-"),
      count: 0,
      imageUrl: SAMPLE_IMAGES[0].url,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem("sana_amnis_admin_categories", JSON.stringify(updated));
    setCatName("");
    setCatSlug("");
    setActiveModal(null);
    showToast(`Created category "${catName}"`);
  };

  // Coupon Actions
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoup = {
      id: `${Date.now()}`,
      code: coupCode.toUpperCase(),
      discount: coupType === "percentage" ? `${coupDiscount}% OFF` : `₦${Number(coupDiscount).toLocaleString()} OFF`,
      type: coupType,
      status: "active",
    };
    const updated = [...coupons, newCoup];
    setCoupons(updated);
    localStorage.setItem("sana_amnis_admin_coupons", JSON.stringify(updated));
    setCoupCode("");
    setCoupDiscount("");
    setActiveModal(null);
    showToast(`Created discount voucher "${coupCode.toUpperCase()}"`);
  };

  // Table Columns Setup
  const productsColumns = [
    {
      header: "Product Title & Image",
      accessor: (item: (typeof products)[0]) => (
        <div
          onClick={() => handleOpenEditProduct(item)}
          className="flex items-center gap-3 cursor-pointer group/item py-1"
        >
          <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shrink-0 group-hover/item:border-primary transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-white group-hover/item:text-primary transition-colors">
              {item.title}
            </h4>
            <span className="text-[10px] text-neutral-400 font-sans block">{item.description || "Organic formulation"}</span>
          </div>
        </div>
      ),
    },
    { header: "SKU", accessor: "sku" as const },
    { header: "Category", accessor: "category" as const },
    {
      header: "Price",
      accessor: (item: (typeof products)[0]) => (
        <span className="font-serif font-semibold text-white">₦{Number(item.price).toLocaleString()}</span>
      ),
    },
    {
      header: "Stock Status",
      accessor: (item: (typeof products)[0]) => (
        <span className={item.stock > 10 ? "text-emerald-400 font-semibold text-xs" : "text-amber-400 font-semibold text-xs"}>
          {item.stock} items available
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (item: (typeof products)[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEditProduct(item)}
            className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800"
            title="Edit Product Details"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduct(item.id, item.title)}
            className="p-2 text-destructive hover:bg-destructive/10"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const categoriesColumns = [
    { header: "Category Name", accessor: "name" as const },
    { header: "Slug Path", accessor: "slug" as const },
    { header: "Total Products Linked", accessor: "count" as const },
    {
      header: "Actions",
      accessor: (item: (typeof categories)[0]) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const updated = categories.filter((c) => c.id !== item.id);
            setCategories(updated);
            localStorage.setItem("sana_amnis_admin_categories", JSON.stringify(updated));
            showToast(`Removed category "${item.name}"`);
          }}
          className="p-2 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const couponsColumns = [
    { header: "Coupon Code", accessor: "code" as const },
    { header: "Benefit", accessor: "discount" as const },
    { header: "Type", accessor: "type" as const },
    {
      header: "Status",
      accessor: (item: (typeof coupons)[0]) => (
        <Badge variant={item.status === "active" ? "success" : "destructive"}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (item: (typeof coupons)[0]) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const updated = coupons.filter((c) => c.id !== item.id);
            setCoupons(updated);
            localStorage.setItem("sana_amnis_admin_coupons", JSON.stringify(updated));
            showToast(`Removed voucher "${item.code}"`);
          }}
          className="p-2 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const tabContents = [
    {
      id: "products",
      label: "Products Catalog",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-neutral-900/60 p-4 border border-neutral-800">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-sans">
                Formulation Inventory ({products.length})
              </h3>
              <p className="text-[11px] text-neutral-400">Click any product row or edit button to update title, price, stock, or storefront images.</p>
            </div>
            <Button
              size="sm"
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2"
            >
              <Plus className="w-4 h-4" /> Add Product
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
          <div className="flex justify-between items-center bg-neutral-900/60 p-4 border border-neutral-800">
            <h3 className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-sans">
              Categories Directory ({categories.length})
            </h3>
            <Button
              size="sm"
              onClick={() => setActiveModal("category")}
              className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2"
            >
              <Plus className="w-4 h-4" /> Add Category
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
          <div className="flex justify-between items-center bg-neutral-900/60 p-4 border border-neutral-800">
            <h3 className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-sans">
              Campaign Vouchers ({coupons.length})
            </h3>
            <Button
              size="sm"
              onClick={() => setActiveModal("coupon")}
              className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2"
            >
              <Plus className="w-4 h-4" /> Create Coupon
            </Button>
          </div>
          <Table columns={couponsColumns} data={coupons} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-5 py-3 shadow-2xl flex items-center gap-3 text-xs uppercase tracking-wider font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">
          Catalog Manager & CMS
        </h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Administer Formulations, Custom Images, Collections, and Discount Vouchers
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabContents} />

      {/* Product Editor Modal (Add & Edit) */}
      {(activeModal === "add-product" || activeModal === "edit-product") && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50 overflow-y-auto py-10">
          <div className="max-w-xl w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-neutral-800 pb-4">
              <h3 className="font-serif text-xl font-semibold text-white">
                {activeModal === "edit-product" ? "Edit Product Formulation" : "Add New Formulation"}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {activeModal === "edit-product" ? "Update inventory details and storefront presentation" : "Publish a new product item to the store catalog"}
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. Extra Virgin Coconut Oil"
                  className="w-full bg-neutral-950 border border-neutral-800 p-3.5 text-xs text-white outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                    SKU Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="e.g. SA-COCO-OIL-250"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3.5 text-xs text-white outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                    Category
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3.5 text-xs text-white outline-none focus:border-primary transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3.5 text-xs text-white outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3.5 text-xs text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Product Image URL & Preview */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" /> Product Image (URL / Presets)
                </label>

                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prodImageUrl || SAMPLE_IMAGES[0].url}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      required
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      placeholder="Paste image URL (e.g. https://...)"
                      className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary transition-colors"
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">Presets:</span>
                      {SAMPLE_IMAGES.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setProdImageUrl(sample.url)}
                          className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-xs transition-colors"
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                  Description / Ingredients
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Describe benefits, organic ingredients, packaging size..."
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-none border-neutral-800 text-neutral-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider">
                  {activeModal === "edit-product" ? "Save Changes" : "Publish Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {activeModal === "category" && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
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
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Slug Path</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="e.g. premium-skincare"
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary"
                />
              </div>
              <Button type="submit" className="w-full rounded-none mt-2">
                Add Category
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {activeModal === "coupon" && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
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
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary"
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
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Discount Type</label>
                  <select
                    value={coupType}
                    onChange={(e) => setCoupType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary"
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
          </div>
        </div>
      )}
    </div>
  );
}
