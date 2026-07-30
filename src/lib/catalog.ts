/**
 * Sana Amnis product catalog — the single source of truth.
 *
 * Every page, the database seed and the order pricing logic all read from here,
 * so a product can never show one price on the homepage and another in the cart.
 *
 * IDs are deterministic UUIDs derived from the slug/SKU (see scripts/generate-ids.mjs).
 * That means a variant has the same id whether a page rendered from Postgres or fell
 * back to this file, so a cart built while the database was unreachable still
 * resolves to real rows at checkout.
 *
 * This module is pure data — no node built-ins — so it is safe to import from
 * client components as well as server components.
 */

export interface CatalogVariant {
  /** Deterministic UUID. Matches product_variants.id in Postgres. */
  id: string;
  sku: string;
  /** Human label for the size/format, e.g. "500ml Bottle". */
  name: string;
  /** Price in Naira, as a whole number. */
  price: number;
  stock: number;
  /** Falls back to the product's primary image when unset. */
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
  /** One-line hook used on cards. */
  tagline: string;
  /** Long copy for the product page. */
  description: string;
  categorySlug: CategorySlug;
  /** First entry is the primary image. */
  images: string[];
  variants: CatalogVariant[];
  badge?: string;
  /**
   * True when we are still using the brand placeholder because the client has
   * not supplied studio photography for this product yet.
   */
  photographyPending?: boolean;
}

export type CategorySlug = "hydration" | "culinary" | "oils" | "body";

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
  oils: {
    id: "171c75d9-cb73-56e1-abfa-872509649461",
    slug: "oils",
    name: "Cold-Pressed Oils",
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
    title: "Pure Coconut Water",
    tagline: "Nature's best — bottled within hours of harvest, with no added sugar.",
    description:
      "One hundred percent pure coconut water drawn from young green coconuts grown along the Badagry coastal belt. Naturally rich in potassium, magnesium and the electrolyte salts your body loses through heat and exertion. No added sugar, no concentrate, no preservatives — simply the water as it comes from the nut.",
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
        name: "250ml Pouch",
        price: 3000,
        stock: 150,
        imageUrl: "/products/coconut-water-pouch-250ml.jpg",
      },
      {
        id: "31a5e022-90e4-58cd-a2a5-eff49f933071",
        sku: "SA-CW-500",
        name: "500ml Bottle",
        price: 4500,
        stock: 120,
        imageUrl: "/products/coconut-water-bottle-500ml.jpg",
      },
    ],
  },
  {
    id: "bdc58302-d353-55c5-a193-79d0a265b5a0",
    slug: "coconut-milk-full-cream",
    title: "Coconut Milk Full Cream",
    tagline: "Rich, ready-to-pour coconut milk pressed from fresh mature coconuts.",
    description:
      "A full-cream coconut milk pressed from the meat of mature coconuts and bottled without thickeners or emulsifiers. Pours smooth and stays rich through cooking — built for stews, curries, smoothies and coffee alike.",
    categorySlug: "hydration",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "ee6d9cb0-a0f1-50c2-af4f-1b6c1aa0bef2",
        sku: "SA-CM-500",
        name: "500ml Bottle",
        price: 4000,
        stock: 90,
      },
    ],
  },
  {
    id: "45dd19f8-9d31-5250-a9a7-16d184da7dc4",
    slug: "pure-coconut-milk-powder",
    title: "Pure Coconut Milk Powder",
    tagline: "Spray-dried coconut milk — instant, creamy, and shelf-stable.",
    description:
      "Fresh coconut milk gently spray-dried into a fine powder that reconstitutes in seconds. Gives you the body of full-cream coconut milk with none of the refrigeration, so it keeps in the cupboard and measures exactly to the spoon. No added sugar.",
    categorySlug: "culinary",
    images: [
      "/products/coconut-milk-powder.jpg",
      "/products/coconut-milk-powder-sizes.jpg",
      "/products/coconut-milk-powder-pair.jpg",
    ],
    badge: "NEW",
    variants: [
      {
        id: "765d77a3-35ce-5e5d-9e16-2796f852649c",
        sku: "SA-CMP-250",
        name: "250g Pouch",
        price: 8500,
        stock: 80,
      },
      {
        id: "35763316-68a3-5d4d-8a47-1dcc3aff35d8",
        sku: "SA-CMP-500",
        name: "500g Pouch",
        price: 15000,
        stock: 60,
      },
    ],
  },
  {
    id: "e3c718b9-a87d-5fc0-960c-5227539674b4",
    slug: "extra-virgin-coconut-oil",
    title: "Cold-Pressed Coconut Oil",
    tagline: "Pressed below body temperature and fortified with vitamin A.",
    description:
      "Extra virgin coconut oil extracted from fresh coconut meat using a temperature-controlled hydraulic press held below 37°C, so none of the lauric acid or natural polyphenols are cooked away. Unrefined, unbleached, hexane-free and fortified with vitamin A. Equally at home in a frying pan or on your skin.",
    categorySlug: "oils",
    images: ["/products/coconut-oil-cold-pressed.jpg"],
    badge: "COLD PRESSED",
    variants: [
      {
        id: "0ee7a821-4734-5314-8eb3-505605e26aa5",
        sku: "SA-CO-CP-500",
        name: "500ml Bottle",
        price: 15000,
        stock: 50,
      },
      {
        id: "aa60f9df-efd5-584d-aa1d-d2ef20e4f322",
        sku: "SA-CO-CP-1L",
        name: "1 Litre Bottle",
        price: 28000,
        stock: 30,
      },
    ],
  },
  {
    id: "5dcf5100-1e8a-5f3e-a10f-77699837caa4",
    slug: "coconut-oil-hot-pressed",
    title: "Hot-Pressed Coconut Oil",
    tagline: "A robust, high-yield cooking oil with a deeper toasted character.",
    description:
      "Traditionally hot-pressed coconut oil with the fuller, nuttier flavour that comes from heat extraction. A higher smoke point than our cold-pressed bottle makes it the better choice for frying, roasting and everyday Nigerian cooking. Fortified with vitamin A.",
    categorySlug: "oils",
    images: ["/products/coconut-oil-hot-pressed.jpg"],
    variants: [
      {
        id: "9545e5d0-c1ac-5441-a59d-155e360669b2",
        sku: "SA-CO-HP-1L",
        name: "1 Litre Bottle",
        price: 22000,
        stock: 40,
      },
    ],
  },
  {
    id: "e94a2088-3b8f-598c-8e9f-32155f119dfc",
    slug: "carrot-oil",
    title: "Carrot Oil",
    tagline: "Carrot infused in coconut oil — for skin and hair.",
    description:
      "A rich blend of carrot infused into our own coconut oil, carrying the beta-carotene and natural vitamin A that carrots are prized for. Traditionally used to even skin tone and add warmth and shine to hair.",
    categorySlug: "body",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "56b330c6-eff3-5f63-ad43-919d1358de2e",
        sku: "SA-CRT-100",
        name: "100ml Bottle",
        price: 6500,
        stock: 70,
      },
    ],
  },
  {
    id: "fed4bb64-a747-5580-865a-196d06b29b48",
    slug: "avococo-oil",
    title: "Avococo Oil",
    tagline: "Avocado and coconut, blended for deep conditioning.",
    description:
      "A blend of avocado and coconut oils. Avocado brings heavier, slower-absorbing lipids and vitamin E; coconut brings lauric acid and a lighter finish. Together they make a conditioning oil that suits dry skin and thick or coily hair.",
    categorySlug: "body",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "f1eeee32-20fe-54bd-b758-424ed7cd2e62",
        sku: "SA-AVC-100",
        name: "100ml Bottle",
        price: 7000,
        stock: 70,
      },
    ],
  },
  {
    id: "e9d0e6d4-d4e9-514a-9960-4d7889609c32",
    slug: "coconut-lip-balm",
    title: "Coconut Lip Balm",
    tagline: "A pocket-sized balm of coconut oil, beeswax and vitamin E.",
    description:
      "Our coconut oil in its most portable form. A small, smooth balm that melts on contact to seal moisture into dry or cracked lips, with no synthetic fragrance and nothing that tastes of plastic.",
    categorySlug: "body",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "e7cd0526-945d-57ee-bc22-a67a1e56fe86",
        sku: "SA-LIP-05",
        name: "5g Stick",
        price: 2500,
        stock: 200,
      },
    ],
  },
  {
    id: "966a4c2f-188b-5635-8e33-b7a6adde6122",
    slug: "coconut-flakes",
    title: "Coconut Flakes",
    tagline: "Dehydrated crispy coconut — snack it, or bake with it.",
    description:
      "Broad flakes of coconut meat dehydrated until crisp, with nothing added. Eat them straight from the pouch as a snack, scatter them over granola and yoghurt, or fold them into baking for texture.",
    categorySlug: "culinary",
    images: ["/products/coconut-flakes.jpg"],
    variants: [
      {
        id: "0f786e66-cfdc-5574-a16d-c11ce804d127",
        sku: "SA-FLK-50",
        name: "50g Pouch",
        price: 2000,
        stock: 120,
      },
      {
        id: "88320a11-2f30-53f7-856b-7534375df355",
        sku: "SA-FLK-100",
        name: "100g Pouch",
        price: 3500,
        stock: 100,
      },
    ],
  },
  {
    id: "6b1b7b82-225d-5d85-a964-2dfc715b7840",
    slug: "organic-coconut-chips",
    title: "Toasted Coconut Chips",
    tagline: "Golden-toasted coconut with a whisper of sea salt.",
    description:
      "Coconut chips toasted to a deep gold and finished with a little sea salt. Higher in dietary fibre and natural fats than most things you would otherwise reach for at four in the afternoon.",
    categorySlug: "culinary",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "6493cc19-29b0-5ee0-a855-a2e87db4bc7e",
        sku: "SA-CHP-100",
        name: "100g Snack Pack",
        price: 3500,
        stock: 100,
      },
    ],
  },
  {
    id: "8efbbe4b-72ab-5715-9918-5b9f443f89f6",
    slug: "desiccated-coconut",
    title: "Desiccated Coconut",
    tagline: "Finely shredded, unsweetened coconut for baking and cooking.",
    description:
      "Coconut meat shredded fine and dried, with no sugar and no sulphites. A staple for cakes, chin chin, coconut rice and confectionery, and a straight substitute anywhere a recipe calls for desiccated coconut.",
    categorySlug: "culinary",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "3559eea7-f923-5f08-b14c-8a87bdb18ff0",
        sku: "SA-DES-250",
        name: "250g Pouch",
        price: 4500,
        stock: 90,
      },
    ],
  },
  {
    id: "348c9791-20f1-5f88-956b-bcda6ea8a38b",
    slug: "coconut-poundo",
    title: "Coconut Poundo",
    tagline: "A coconut-based swallow — smooth, filling and low-carb.",
    description:
      "Made from coconut, mixed and moulded exactly as you would poundo yam, and eaten with the same soups. Far lower in carbohydrate than yam or cassava flour, which makes it a genuine option for anyone managing blood sugar without giving up swallow.",
    categorySlug: "culinary",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "41c676c6-5618-5f30-9ec6-47f10c309d26",
        sku: "SA-PND-1000",
        name: "1kg Pack",
        price: 7500,
        stock: 60,
      },
    ],
  },
  {
    id: "39d0690d-6616-5f09-b2ef-f0b44d2b152b",
    slug: "raw-coconut-flour",
    title: "Raw Organic Coconut Flour",
    tagline: "High-fibre, gluten-free flour ground from coconut meat.",
    description:
      "Coconut meat milled to a fine, soft flour. Naturally gluten-free and very high in fibre, so it drinks up considerably more liquid than wheat flour — worth accounting for when you adapt a recipe. Suits keto and paleo baking.",
    categorySlug: "culinary",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "72c025af-c38e-532b-900f-cc40f4c1f418",
        sku: "SA-FLR-500",
        name: "500g Pack",
        price: 6000,
        stock: 75,
      },
    ],
  },
  {
    id: "ee59777a-b3a0-516f-bc59-c05a2dc4b934",
    slug: "coconut-body-butter",
    title: "Nourishing Coconut Body Butter",
    tagline: "Whipped coconut lipids and shea for a restored moisture barrier.",
    description:
      "A deeply moisturising body cream whipped from raw coconut lipids, unrefined shea butter and vitamin E. Heavier than a lotion and built for genuinely dry skin — it restores elasticity and leaves a soft, velvety finish rather than a greasy one.",
    categorySlug: "body",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "a59bbefa-c0dc-5fbf-b5d3-fc6ccece256d",
        sku: "SA-BTR-200",
        name: "200g Jar",
        price: 18000,
        stock: 40,
      },
    ],
  },
  {
    id: "bee955ea-1849-5a86-91c7-194b8fee6d88",
    slug: "restorative-coconut-hair-mask",
    title: "Restorative Coconut Hair Mask",
    tagline: "An intensive pre-wash treatment for stressed lengths and ends.",
    description:
      "A deep conditioning treatment built on raw coconut oil and botanical extracts. Worked through damp hair and left for half an hour before washing, it strengthens the shaft, reduces split ends and restores shine to hair worn down by heat or chemical processing.",
    categorySlug: "body",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "6b457e20-0acd-5ac8-8667-154a81e896ec",
        sku: "SA-HMK-250",
        name: "250ml Jar",
        price: 14000,
        stock: 35,
      },
    ],
  },
  {
    id: "a9ed1ff4-f7e3-5910-b958-618232274349",
    slug: "coconut-sugar-scrub",
    title: "Exfoliating Coconut Sugar Scrub",
    tagline: "Unrefined coconut sugar suspended in virgin coconut oil.",
    description:
      "Crystals of unrefined coconut sugar suspended in virgin coconut oil. The sugar buffs away dead skin while the oil stays behind, so skin is left smooth and conditioned rather than stripped. Gentle enough for weekly use.",
    categorySlug: "body",
    images: [PLACEHOLDER_IMAGE],
    photographyPending: true,
    variants: [
      {
        id: "5be37769-958c-570f-b513-a1076e4e0967",
        sku: "SA-SCR-200",
        name: "200g Glass Jar",
        price: 12500,
        stock: 45,
      },
    ],
  },
];

/** Slugs shown in the "Featured" grid on the homepage, in order. */
export const FEATURED_SLUGS = [
  "sana-amnis-coconut-water",
  "extra-virgin-coconut-oil",
  "pure-coconut-milk-powder",
  "coconut-flakes",
] as const;

export function getCategory(slug: CategorySlug): CatalogCategory {
  return CATEGORIES[slug];
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.slug === slug);
}

/** Look a variant up by its UUID, returning the parent product alongside it. */
export function findVariant(
  variantId: string
): { product: CatalogProduct; variant: CatalogVariant } | undefined {
  for (const product of CATALOG) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}

/** The image a variant should display, falling back to the product's primary shot. */
export function variantImage(product: CatalogProduct, variant?: CatalogVariant): string {
  return variant?.imageUrl || product.images[0] || PLACEHOLDER_IMAGE;
}

/** Lowest price across a product's variants — what "from ₦x" should show. */
export function startingPrice(product: CatalogProduct): number {
  return Math.min(...product.variants.map((v) => v.price));
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}
