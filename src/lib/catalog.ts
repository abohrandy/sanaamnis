/** Sana Amnis catalogue — shared by storefront, seed data and order pricing. */

export interface CatalogVariant {
  id: string;
  sku: string;
  /** Display label for the selectable size/type; packaging words are omitted. */
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  categorySlug: CategorySlug;
  extraCategorySlugs?: CategorySlug[];
  images: string[];
  variants: CatalogVariant[];
  badge?: string;
  photographyPending?: boolean;
}

export type CategorySlug = "hydration" | "culinary" | "body";
export const PLACEHOLDER_IMAGE = "/products/placeholder.jpg";

export const CATEGORIES: Record<CategorySlug, CatalogCategory> = {
  hydration: {
    id: "bfc34bda-dbd1-569a-9541-425f95862f78",
    slug: "hydration",
    name: "Hydration",
  },
  culinary: {
    id: "fb0c950a-af25-567d-8d7c-ee6c4adfc8ac",
    slug: "culinary",
    name: "Culinary Essentials",
  },
  body: {
    id: "11038842-b08b-5840-8cc4-4dd138cd714b",
    slug: "body",
    name: "Skin & Body",
  },
};

export const CATALOG: CatalogProduct[] = [
  {
    id: "b02e6a54-39c4-595e-bff6-937beb679466",
    slug: "sana-amnis-coconut-water",
    title: "Coconut Water",
    tagline: "Pure coconut water, made in Nigeria from home-grown coconuts.",
    description:
      "Pure coconut water drawn from young green coconuts grown by local farmers across Nigeria. No added sugar, no concentrate and no preservatives.",
    categorySlug: "hydration",
    images: [
      "/products/coconut-water-range.jpg",
      "/products/coconut-water-pouch-250ml.jpg",
      "/products/coconut-water-bottle-500ml.jpg",
    ],
    badge: "NO ADDED SUGAR",
    variants: [
      {
        id: "def59067-c0eb-5884-b1d1-0585c3529edb",
        sku: "SA-CW-250",
        name: "250ml",
        price: 1500,
        stock: 150,
        imageUrl: "/products/coconut-water-pouch-250ml.jpg",
      },
      {
        id: "31a5e022-90e4-58cd-a2a5-eff49f933071",
        sku: "SA-CW-500",
        name: "500ml",
        price: 3000,
        stock: 120,
        imageUrl: "/products/coconut-water-bottle-500ml.jpg",
      },
    ],
  },
  {
    id: "45dd19f8-9d31-5250-a9a7-16d184da7dc4",
    slug: "pure-coconut-milk-powder",
    title: "Coconut Milk Powder",
    tagline: "Instant coconut milk powder for cooking and baking.",
    description:
      "Coconut milk made in Nigeria from home-grown coconuts, gently spray-dried into a fine powder that reconstitutes in seconds.",
    categorySlug: "culinary",
    images: [
      "/products/coconut-milk-powder.jpg",
      "/products/coconut-milk-powder-sizes.jpg",
      "/products/coconut-milk-powder-pair.jpg",
    ],
    badge: "NEW",
    variants: [
      { id: "6d396826-aed2-5b9a-a316-efcc7b8ae204", sku: "SA-CMP-100", name: "100g", price: 5000, stock: 80, imageUrl: "/products/coconut-milk-powder.jpg" },
      { id: "35763316-68a3-5d4d-8a47-1dcc3aff35d8", sku: "SA-CMP-500", name: "500g", price: 22000, stock: 60, imageUrl: "/products/coconut-milk-powder-sizes.jpg" },
      { id: "b96b58bf-56ee-5618-88b5-c9f68ff72028", sku: "SA-CMP-1000", name: "1kg", price: 42000, stock: 40, imageUrl: "/products/coconut-milk-powder-pair.jpg" },
    ],
  },
  {
    id: "e3c718b9-a87d-5fc0-960c-5227539674b4",
    slug: "extra-virgin-coconut-oil",
    title: "Coconut Oil",
    tagline: "Cold Press and Hot Press coconut oil for cooking and personal care.",
    description:
      "Coconut oil made in Nigeria from home-grown coconuts. Choose Cold Press for its natural coconut character or Hot Press for cooking.",
    categorySlug: "culinary",
    extraCategorySlugs: ["body"],
    images: [
      "/products/coconut-oil-cold-pressed.jpg",
      "/products/coconut-oil-cold-pressed-100ml.jpg",
      "/products/coconut-oil-cold-pressed-500ml.jpg",
      "/products/coconut-oil-cold-pressed-1l.jpg",
      "/products/coconut-oil-hot-pressed.jpg",
      "/products/coconut-oil-hot-pressed-trio.jpg",
    ],
    badge: "COLD + HOT PRESS",
    variants: [
      { id: "8b1ea61d-8b9f-55b9-9a39-0909eff7765a", sku: "SA-CO-CP-100", name: "Cold Press · 100ml", price: 3000, stock: 80, imageUrl: "/products/coconut-oil-cold-pressed-100ml.jpg" },
      { id: "0ee7a821-4734-5314-8eb3-505605e26aa5", sku: "SA-CO-CP-500", name: "Cold Press · 500ml", price: 13000, stock: 50, imageUrl: "/products/coconut-oil-cold-pressed-500ml.jpg" },
      { id: "aa60f9df-efd5-584d-aa1d-d2ef20e4f322", sku: "SA-CO-CP-1L", name: "Cold Press · 1 litre", price: 25000, stock: 30, imageUrl: "/products/coconut-oil-cold-pressed-1l.jpg" },
      { id: "9545e5d0-c1ac-5441-a59d-155e360669b2", sku: "SA-CO-HP-1L", name: "Hot Press · 1 litre", price: 25000, stock: 40, imageUrl: "/products/coconut-oil-hot-pressed.jpg" },
    ],
  },
  {
    id: "e94a2088-3b8f-598c-8e9f-32155f119dfc",
    slug: "carrot-oil",
    title: "Carrot Oil",
    tagline: "Carrot infused in coconut oil for skin and hair.",
    description: "Carrot oil made in Nigeria for everyday personal care.",
    categorySlug: "body",
    images: ["/products/carrot-oil.jpg", "/products/carrot-oil-lifestyle.jpg"],
    variants: [
      { id: "56b330c6-eff3-5f63-ad43-919d1358de2e", sku: "SA-CRT-100", name: "100ml", price: 3500, stock: 70, imageUrl: "/products/carrot-oil.jpg" },
      { id: "1cc01abb-1d7a-5b1e-9c02-18c774d67349", sku: "SA-CRT-200", name: "200ml", price: 7000, stock: 50, imageUrl: "/products/carrot-oil-lifestyle.jpg" },
    ],
  },
  {
    id: "fed4bb64-a747-5580-865a-196d06b29b48",
    slug: "avococo-oil",
    title: "Avocado Oil",
    tagline: "Avocado oil for everyday skin and hair care.",
    description: "Avocado oil made in Nigeria for everyday personal care.",
    categorySlug: "body",
    images: ["/products/avococo-oil.jpg", "/products/avococo-oil-trio.jpg"],
    variants: [{ id: "f1eeee32-20fe-54bd-b758-424ed7cd2e62", sku: "SA-AVC-100", name: "100ml", price: 4500, stock: 70, imageUrl: "/products/avococo-oil.jpg" }],
  },
  {
    id: "e9d0e6d4-d4e9-514a-9960-4d7889609c32",
    slug: "coconut-lip-balm",
    title: "Lip Balm",
    tagline: "A coconut oil, beeswax and vitamin E balm.",
    description: "A small balm made for everyday lip care.",
    categorySlug: "body",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [{ id: "e7cd0526-945d-57ee-bc22-a67a1e56fe86", sku: "SA-LIP-05", name: "5g", price: 1500, stock: 200 }],
  },
  {
    id: "966a4c2f-188b-5635-8e33-b7a6adde6122",
    slug: "coconut-flakes",
    title: "Coconut Flakes",
    tagline: "Dehydrated coconut for snacking and baking.",
    description: "Coconut flakes made in Nigeria from home-grown coconuts.",
    categorySlug: "culinary",
    images: ["/products/coconut-flakes.jpg"],
    variants: [
      { id: "0f786e66-cfdc-5574-a16d-c11ce804d127", sku: "SA-FLK-50", name: "50g", price: 1500, stock: 120, imageUrl: "/products/coconut-flakes.jpg" },
      { id: "88320a11-2f30-53f7-856b-7534375df355", sku: "SA-FLK-100", name: "100g", price: 2500, stock: 100, imageUrl: "/products/coconut-flakes.jpg" },
      { id: "79397f01-50da-5ee1-859e-b42e475d1492", sku: "SA-FLK-500", name: "500g", price: 10000, stock: 60, imageUrl: "/products/coconut-flakes.jpg" },
      { id: "9a830966-577b-5145-95e9-f15e18dd87ac", sku: "SA-FLK-1000", name: "1kg", price: 20000, stock: 40, imageUrl: "/products/coconut-flakes.jpg" },
    ],
  },
  {
    id: "348c9791-20f1-5f88-956b-bcda6ea8a38b",
    slug: "coconut-poundo",
    title: "Coconut Poundo",
    tagline: "A coconut-based swallow for the kitchen.",
    description: "Coconut poundo made in Nigeria from home-grown coconuts.",
    categorySlug: "culinary",
    images: ["/products/coconut-poundo.jpg", "/products/coconut-poundo-pair.jpg"],
    variants: [{ id: "001b416d-98cc-567f-abae-53fef4c8330c", sku: "SA-PND-750", name: "750g", price: 6500, stock: 60, imageUrl: "/products/coconut-poundo.jpg" }],
  },
  {
    id: "39d0690d-6616-5f09-b2ef-f0b44d2b152b",
    slug: "raw-coconut-flour",
    title: "Coconut Flour",
    tagline: "Fine coconut flour for baking and cooking.",
    description: "Coconut flour milled in Nigeria from home-grown coconuts.",
    categorySlug: "culinary",
    images: ["/products/coconut-flour.jpg", "/products/coconut-flour-single.jpg"],
    variants: [{ id: "069d43aa-fbd7-549e-ba77-2fe5745d87cf", sku: "SA-FLR-750", name: "750g", price: 6000, stock: 75, imageUrl: "/products/coconut-flour.jpg" }],
  },
];

export const FEATURED_SLUGS = [
  "sana-amnis-coconut-water",
  "extra-virgin-coconut-oil",
  "pure-coconut-milk-powder",
  "coconut-flakes",
] as const;

export function getCategory(slug: CategorySlug): CatalogCategory { return CATEGORIES[slug]; }
export function getProductBySlug(slug: string): CatalogProduct | undefined { return CATALOG.find((p) => p.slug === slug); }
export function findVariant(variantId: string): { product: CatalogProduct; variant: CatalogVariant } | undefined {
  for (const product of CATALOG) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}
export function variantImage(product: CatalogProduct, variant?: CatalogVariant): string { return variant?.imageUrl || product.images[0] || PLACEHOLDER_IMAGE; }
export function startingPrice(product: CatalogProduct): number { return Math.min(...product.variants.map((v) => v.price)); }
export function formatNaira(amount: number): string { return `₦${Math.round(amount).toLocaleString("en-NG")}`; }
export function searchProducts(query: string, limit = 20): CatalogProduct[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return CATALOG
    .map((product) => {
      const title = product.title.toLowerCase();
      const haystack = [title, product.tagline, product.description, CATEGORIES[product.categorySlug].name, ...(product.extraCategorySlugs ?? []).map((s) => CATEGORIES[s].name), ...product.variants.map((v) => `${v.name} ${v.sku}`)].join(" ").toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return null;
      const score = terms.reduce((sum, term) => sum + (title.startsWith(term) ? 3 : title.includes(term) ? 2 : 1), 0);
      return { product, score };
    })
    .filter(Boolean)
    .sort((a, b) => (b as { score: number }).score - (a as { score: number }).score)
    .slice(0, limit)
    .map((entry) => (entry as { product: CatalogProduct }).product);
}
