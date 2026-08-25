/**
 * Bundles — fixed sets of product variants sold together at a flat price.
 *
 * Same DB-first-with-fallback shape as src/lib/products.ts: the database wins
 * when reachable, BUNDLES backstops an empty or unreachable database so the
 * storefront and build never hard-fail on it.
 */
import { db } from "@/db";
import { findVariant, type CatalogVariant, type CatalogProduct } from "@/lib/catalog";

export interface RawBundleItem {
  variantId: string;
  quantity: number;
}

export interface RawBundle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  regularValue?: number;
  badge?: string;
  heroImageUrl: string;
  items: RawBundleItem[];
}

export interface ResolvedBundleItem {
  variantId: string;
  quantity: number;
  sku: string;
  variantName: string;
  productTitle: string;
  productSlug: string;
  imageUrl?: string;
  unitPrice: number;
}

export interface Bundle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  regularValue?: number;
  badge?: string;
  heroImageUrl: string;
  items: ResolvedBundleItem[];
}

/**
 * Bundle content the client supplied — 🍚🥥 Rice Don Set, Better Breakfast,
 * 30-Day Active Lifestyle and Coco Glow. Variant ids match src/lib/catalog.ts.
 */
export const BUNDLES: RawBundle[] = [
  {
    id: "f6cd70c7-c509-4901-96da-ae3007bdeca7",
    slug: "rice-don-set",
    title: "Rice Don Set! Coconut Rice Bundle",
    tagline: "Everything coconut you need to cook a rich, creamy coconut rice meal for the whole family.",
    description:
      "Everything coconut you need to turn an ordinary pot of rice into a rich, creamy and delicious coconut rice meal for the whole family!\n\nOur Full-Cream Coconut Milk gives your rice that rich, creamy base and unmistakable coconut flavour. Use the Cold-Pressed Coconut Oil to sauté your onions, peppers, vegetables and protein, adding another delicious layer of coconut goodness. Want it extra rich and coconutty? Add some Coconut Milk Powder to your coconut milk while cooking to boost the creamy flavour and adjust the richness to your taste.\n\nThe Rice Don Set Bundle gives you the coconut essentials for preparing a delicious coconut rice meal for approximately 4–6 people. Simply add your rice, favourite protein, vegetables and seasonings — Sana Amnis brings the coconut magic.",
    price: 20000,
    heroImageUrl: "/bundles/rice-don-set.jpg",
    items: [
      { variantId: "ee6d9cb0-a0f1-50c2-af4f-1b6c1aa0bef2", quantity: 2 }, // 500ml Full-Cream Coconut Milk
      { variantId: "0cc58ae1-3e61-5aa7-a8b3-c7aaaaf6f4fe", quantity: 1 }, // 200ml Cold-Pressed Coconut Oil
      { variantId: "6d396826-aed2-5b9a-a316-efcc7b8ae204", quantity: 1 }, // 100g Coconut Milk Powder
    ],
  },
  {
    id: "de8a4feb-1b87-40f6-acf1-fc298f037177",
    slug: "better-breakfast",
    title: "Better Breakfast Bundle",
    tagline: "Everything you need to make breakfast healthier, tastier and deliciously coconutty.",
    description:
      "Everything you need to make breakfast healthier, tastier and deliciously coconutty!\n\nOur Coconut Flour is naturally rich in fibre. Use it for pancakes, waffles, bread and cookies, or combine it with your regular flour to add more fibre to your favourite breakfast recipes. Coconut Milk Powder is a convenient breakfast companion — add it to pap (ogi), oats, tea, coffee, smoothies, cereals and other drinks for a rich, creamy coconut taste.\n\nUse Coconut Flakes and Desiccated Coconut as delicious toppings for oats, yoghurt, smoothie bowls, pancakes and cereals, or add them to bread, cookies and other baked treats. And with 500ml Cold-Pressed Coconut Oil, you have a versatile kitchen essential for pancakes, eggs, baking, sautéing and everyday cooking.\n\nFrom pancakes and waffles to pap, oats, smoothies and homemade bread — one bundle, so many breakfast possibilities.",
    price: 55000,
    regularValue: 57500,
    badge: "SAVE ₦2,500",
    heroImageUrl: "/bundles/better-breakfast.jpg",
    items: [
      { variantId: "35763316-68a3-5d4d-8a47-1dcc3aff35d8", quantity: 1 }, // 500g Coconut Milk Powder
      { variantId: "79397f01-50da-5ee1-859e-b42e475d1492", quantity: 1 }, // 500g Coconut Flakes
      { variantId: "069d43aa-fbd7-549e-ba77-2fe5745d87cf", quantity: 1 }, // 750g Coconut Flour
      { variantId: "a8a768da-08b0-502c-b3ff-82d2f04d324c", quantity: 2 }, // 100g Desiccated Coconut x2
      { variantId: "0ee7a821-4734-5314-8eb3-505605e26aa5", quantity: 1 }, // 500ml Cold-Pressed Coconut Oil
    ],
  },
  {
    id: "072486ca-1489-49b4-8c4c-c8744595c85a",
    slug: "move-sweat-hydrate",
    title: "Move. Sweat. Hydrate. — 30-Day Active Lifestyle Bundle",
    tagline: "A full month of Sana Amnis coconut goodness for people who love to keep moving.",
    description:
      "A full month of Sana Amnis coconut goodness designed for people who love to keep moving. Whether you're hitting the gym, running, cycling, playing your favourite sport or simply living life on the move, this bundle brings together refreshing coconut water, creamy coconut milk and crunchy coconut snacks for your active lifestyle.\n\nWith 30 portions of coconut water, you've got refreshing coconut goodness ready throughout the month. Enjoy the 500ml bottles around your workouts, runs, football, cycling and more active days, and grab a convenient 250ml portion for lighter activities, outings or busy days on the move.\n\nAdd Coconut Milk Powder to your smoothies for a delicious, rich and creamy coconut taste, or enjoy it in oats, pap, cereals, shakes and other breakfast favourites. Enjoy Coconut Flakes straight from the pack as a convenient snack, or sprinkle them over oats, yoghurt, cereals and smoothie bowls — portion them into smaller servings for work, gym days, travel or whenever you want something coconutty to snack on.\n\nSip it. Blend it. Sprinkle it. Snack on it. One bundle, one month, plenty of possibilities.",
    price: 100000,
    regularValue: 109500,
    badge: "SAVE ₦9,500",
    heroImageUrl: "/bundles/move-sweat-hydrate.jpg",
    items: [
      { variantId: "31a5e022-90e4-58cd-a2a5-eff49f933071", quantity: 20 }, // 500ml Coconut Water x20
      { variantId: "def59067-c0eb-5884-b1d1-0585c3529edb", quantity: 10 }, // 250ml Coconut Water x10
      { variantId: "35763316-68a3-5d4d-8a47-1dcc3aff35d8", quantity: 1 }, // 500g Coconut Milk Powder
      { variantId: "79397f01-50da-5ee1-859e-b42e475d1492", quantity: 1 }, // 500g Coconut Flakes
    ],
  },
  {
    id: "9370acac-173e-4d93-aa51-d8b5cf3f2c5a",
    slug: "move-sweat-hydrate-2-week",
    title: "Move. Sweat. Hydrate. — 2-Week Active Lifestyle Bundle",
    tagline: "Two weeks of Sana Amnis coconut goodness for your active lifestyle.",
    description:
      "Two weeks of Sana Amnis coconut goodness for your active lifestyle. Whether you're hitting the gym, running, cycling, playing your favourite sport or simply living life on the move, this bundle brings together refreshing coconut water, creamy coconut goodness and crunchy coconut snacks to complement your active routine.\n\nEnjoy the 500ml bottles around your workouts, runs, football, cycling and other active days. The convenient 250ml portions are perfect for lighter activities, outings and busy days on the move. With 15 portions of fresh coconut water, you've got plenty of coconut refreshment to spread across your two-week routine.\n\nAdd Coconut Milk Powder to your smoothies and shakes for a rich, creamy coconut taste, or enjoy it in oats, pap, cereals and other breakfast favourites. With 4 handy 50g packs, your coconut snack is already conveniently portioned for your active days — enjoy Coconut Flakes straight from the pack, take one along to work or the gym, or sprinkle them over oats, yoghurt, cereals and smoothie bowls.\n\nSip it. Blend it. Sprinkle it. Snack on it. Two weeks of coconut goodness for life in motion.",
    price: 50000,
    regularValue: 53500,
    badge: "SAVE ₦3,500",
    heroImageUrl: "/bundles/move-sweat-hydrate-2week.jpg",
    items: [
      { variantId: "31a5e022-90e4-58cd-a2a5-eff49f933071", quantity: 10 }, // 500ml Coconut Water x10
      { variantId: "def59067-c0eb-5884-b1d1-0585c3529edb", quantity: 5 }, // 250ml Coconut Water x5
      { variantId: "6d396826-aed2-5b9a-a316-efcc7b8ae204", quantity: 2 }, // 100g Coconut Milk Powder x2
      { variantId: "0f786e66-cfdc-5574-a16d-c11ce804d127", quantity: 4 }, // 50g Coconut Flakes x4
    ],
  },
  {
    id: "0a58d06c-d2d5-4c7c-b351-b7ebf56f806d",
    slug: "coco-glow",
    title: "Coco Glow Bundle",
    tagline: "Nourish. Moisturise. Glow. A simple collection of nourishing oils and lip care for your everyday beauty routine.",
    description:
      "Give your skin, hair and lips a little coconut-powered TLC with the Coco Glow Bundle — a simple collection of nourishing oils and lip care for your everyday beauty routine.\n\nCoconut Oil moisturises: apply a small amount to slightly damp skin after bathing and massage gently until absorbed, paying extra attention to dry areas such as elbows, knees and heels. It can also be used on the hair or as a pre-shampoo oil treatment. Carrot Oil nourishes: apply a few drops to clean skin and massage gently, on its own as a body oil or added to your favourite body cream. Avococo Oil softens and conditions: massage a small amount into your skin after bathing, or apply to dry hair as a pre-shampoo treatment. Coconut Oil Lip Balm keeps your lips soft: apply whenever needed — with two lip balms in the bundle, keep one at home and the other in your bag.\n\nMorning: Avococo Oil on clean skin, finished with your lip balm. After your bath: Cold-Pressed Coconut Oil on slightly damp skin. Evening: a few drops of Carrot Oil as part of your night-time routine, finished with lip balm before bed. Hair-care day: Coconut Oil or Avococo Oil as a pre-shampoo treatment before your regular wash.\n\nFrom your skin to your hair and lips, Coco Glow makes it easy to bring the natural goodness of Sana Amnis oils into your everyday self-care routine.\n\nFor external use only. Patch test before first use and discontinue use if irritation occurs.",
    price: 19000,
    regularValue: 20500,
    badge: "SAVE ₦1,500",
    heroImageUrl: "/bundles/coco-glow.jpg",
    items: [
      { variantId: "0cc58ae1-3e61-5aa7-a8b3-c7aaaaf6f4fe", quantity: 1 }, // 200ml Cold-Pressed Coconut Oil
      { variantId: "1cc01abb-1d7a-5b1e-9c02-18c774d67349", quantity: 1 }, // 200ml Carrot Oil
      { variantId: "f1eeee32-20fe-54bd-b758-424ed7cd2e62", quantity: 1 }, // 100ml Avococo Oil
      { variantId: "e7cd0526-945d-57ee-bc22-a67a1e56fe86", quantity: 2 }, // Lip Balm x2
    ],
  },
];

function resolveItem(raw: RawBundleItem): ResolvedBundleItem | null {
  const found = findVariant(raw.variantId);
  if (!found) return null;
  const { product, variant } = found as { product: CatalogProduct; variant: CatalogVariant };
  return {
    variantId: raw.variantId,
    quantity: raw.quantity,
    sku: variant.sku,
    variantName: variant.name,
    productTitle: product.title,
    productSlug: product.slug,
    imageUrl: variant.imageUrl ?? product.images[0],
    unitPrice: variant.price,
  };
}

function fromFallback(raw: RawBundle): Bundle {
  return {
    ...raw,
    items: raw.items.map(resolveItem).filter((i): i is ResolvedBundleItem => i !== null),
  };
}

type DbBundleRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  price: string;
  regularValue: string | null;
  badge: string | null;
  heroImageUrl: string | null;
  items: Array<{
    variantId: string;
    quantity: number;
    variant: {
      sku: string;
      name: string;
      price: string;
      imageUrl: string | null;
      product: { title: string; slug: string } | null;
    } | null;
  }>;
};

function fromDb(row: DbBundleRow): Bundle {
  const seed = BUNDLES.find((b) => b.slug === row.slug);
  const items: ResolvedBundleItem[] = row.items
    .map((item): ResolvedBundleItem | null => {
      if (!item.variant?.product) return null;
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        sku: item.variant.sku,
        variantName: item.variant.name,
        productTitle: item.variant.product.title,
        productSlug: item.variant.product.slug,
        imageUrl: item.variant.imageUrl ?? undefined,
        unitPrice: Number(item.variant.price),
      };
    })
    .filter((i): i is ResolvedBundleItem => i !== null);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline ?? seed?.tagline ?? "",
    description: row.description ?? seed?.description ?? "",
    price: Number(row.price),
    regularValue: row.regularValue ? Number(row.regularValue) : seed?.regularValue,
    badge: row.badge ?? seed?.badge,
    heroImageUrl: row.heroImageUrl || seed?.heroImageUrl || "/products/placeholder.jpg",
    items: items.length > 0 ? items : (seed?.items.map(resolveItem).filter((i): i is ResolvedBundleItem => i !== null) ?? []),
  };
}

/** All published bundles, in display order. */
export async function getBundles(): Promise<Bundle[]> {
  try {
    const rows = await db.query.bundles.findMany({
      where: (bundles, { eq }) => eq(bundles.isPublished, true),
      orderBy: (bundles, { asc }) => [asc(bundles.sortOrder), asc(bundles.createdAt)],
      with: { items: { with: { variant: { with: { product: true } } } } },
    });
    if (rows.length > 0) {
      return (rows as unknown as DbBundleRow[]).map(fromDb);
    }
  } catch (error) {
    console.error("[bundles] database unavailable, serving content fallback:", error);
  }
  return BUNDLES.map(fromFallback);
}

/** A single bundle by slug, or undefined when it does not exist anywhere. */
export async function getBundle(slug: string): Promise<Bundle | undefined> {
  try {
    const row = await db.query.bundles.findFirst({
      where: (bundles, { eq, and }) => and(eq(bundles.slug, slug), eq(bundles.isPublished, true)),
      with: { items: { with: { variant: { with: { product: true } } } } },
    });
    if (row) return fromDb(row as unknown as DbBundleRow);
  } catch (error) {
    console.error(`[bundles] database unavailable for "${slug}", serving content fallback:`, error);
  }
  const seed = BUNDLES.find((b) => b.slug === slug);
  return seed ? fromFallback(seed) : undefined;
}
