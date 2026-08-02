/**
 * Editorial content: recipes and journal articles.
 *
 * Both listing pages previously held their own mock arrays and linked to
 * /recipes/[slug] and /blog/[slug] routes that did not exist, so every "read more"
 * link 404'd. Content lives here and both listing and detail pages read from it.
 *
 * Copy is deliberately practical rather than promotional. The previous version
 * claimed coconuts were "handpicked from volcanic soils" and packaged in
 * "recyclable premium glassware" — neither matches how the coconuts are actually
 * sourced or the pouches and PET bottles in the client's own photography.
 *
 * Pure data, safe to import anywhere.
 */

export interface Faq {
  question: string;
  /** Plain text. A single `[label](/path)` markdown-style link is supported — see parseFaqAnswer() in src/lib/faqs.ts. */
  answer: string;
  category: string;
}

export interface Recipe {
  slug: string;
  title: string;
  excerpt: string;
  /** Total time including any resting. */
  duration: string;
  difficulty: "Easy" | "Simple" | "Takes practice";
  serves: string;
  image: string;
  /** Slugs of products used, for cross-selling on the detail page. */
  usesProducts: string[];
  ingredients: string[];
  steps: string[];
  tip?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date, formatted at render so it stays locale-correct. */
  date: string;
  readingMinutes: number;
  image: string;
  /** Paragraphs and subheadings, in order. */
  body: Array<{ heading?: string; paragraphs: string[] }>;
}

export const RECIPES: Recipe[] = [
  {
    slug: "coconut-rice",
    title: "Coconut rice",
    excerpt:
      "Jollof's quieter cousin. Coconut milk powder gives you the richness without opening a tin you then have to finish.",
    duration: "35 mins",
    difficulty: "Easy",
    serves: "Serves 4",
    image: "/products/coconut-milk-powder.jpg",
    usesProducts: ["pure-coconut-milk-powder", "extra-virgin-coconut-oil"],
    ingredients: [
      "2 cups long-grain rice, rinsed until the water runs clear",
      "6 tbsp Sana Amnis coconut milk powder, whisked into 500ml warm water",
      "2 tbsp Sana Amnis cold-pressed coconut oil",
      "1 onion, finely diced",
      "2 cloves garlic, crushed",
      "1 scotch bonnet, whole (or halved, if you want the heat)",
      "1 bay leaf, salt to taste",
    ],
    steps: [
      "Warm the coconut oil in a heavy pot over medium heat. Soften the onion for 4–5 minutes without letting it colour, then add the garlic for another minute.",
      "Stir in the rinsed rice and turn it through the oil for a minute so every grain is coated.",
      "Pour in the coconut milk, add the bay leaf, the whole scotch bonnet and a good pinch of salt. Bring to a gentle boil.",
      "Drop the heat to its lowest, cover tightly and leave for 18–20 minutes. Do not lift the lid — the steam is doing the work.",
      "Take it off the heat and let it stand, still covered, for 5 minutes. Remove the bonnet and bay leaf, then fork through gently.",
    ],
    tip: "If the rice is still firm but the liquid has gone, add 3 tbsp of hot water, re-cover and give it another 5 minutes off the direct heat.",
  },
  {
    slug: "coconut-flour-pancakes",
    title: "Coconut flour pancakes",
    excerpt:
      "Gluten-free and high in fibre. Coconut flour drinks up far more liquid than wheat, so the ratios here are not a typo.",
    duration: "20 mins",
    difficulty: "Simple",
    serves: "Makes 8 small pancakes",
    image: "/products/placeholder.jpg",
    usesProducts: ["raw-coconut-flour", "extra-virgin-coconut-oil"],
    ingredients: [
      "60g Sana Amnis coconut flour",
      "4 eggs",
      "180ml milk of your choice",
      "1 tbsp Sana Amnis cold-pressed coconut oil, melted, plus more for the pan",
      "1 tsp baking powder",
      "A pinch of salt, honey to serve",
    ],
    steps: [
      "Whisk the eggs, milk and melted coconut oil together until completely smooth.",
      "Add the coconut flour, baking powder and salt. Whisk hard — coconut flour clumps if you are gentle with it.",
      "Leave the batter to stand for 5 minutes. It will thicken noticeably as the flour absorbs the liquid; this is what should happen.",
      "Heat a little coconut oil in a non-stick pan over medium-low. Spoon in small rounds — these are more fragile than wheat pancakes, so keep them modest.",
      "Cook for 2–3 minutes until the edges set and bubbles hold, then turn carefully and give them another 1–2 minutes.",
    ],
    tip: "If the batter stiffens past pouring consistency while you work, loosen it with a splash of milk rather than adding more flour.",
  },
  {
    slug: "coconut-oil-hair-treatment",
    title: "Pre-wash hair treatment",
    excerpt:
      "A half-hour oil treatment before washing, which suits thick and coily hair better than leaving oil in overnight.",
    duration: "35 mins",
    difficulty: "Easy",
    serves: "One treatment",
    image: "/products/coconut-oil-cold-pressed.jpg",
    usesProducts: ["extra-virgin-coconut-oil", "avococo-oil"],
    ingredients: [
      "3–4 tbsp Sana Amnis cold-pressed coconut oil (more for long or thick hair)",
      "1 tbsp Sana Amnis Avococo oil, if your ends are particularly dry",
      "A wide-tooth comb and a towel you do not mind oiling",
    ],
    steps: [
      "Warm the oil by standing the closed bottle in hot water for a few minutes, or rub it between your palms until it melts. Do not microwave it.",
      "Section damp — not soaking — hair into four. Working one section at a time, apply the oil from mid-length to ends first, then lightly to the scalp.",
      "Comb through with a wide-tooth comb to distribute, then twist each section loosely.",
      "Cover with a towel or cap and leave for 30 minutes.",
      "Shampoo as normal. You will likely need two passes to clear the oil fully.",
    ],
    tip: "Coconut oil solidifies below about 24°C. If it has set hard in the bottle, that is a sign it is unrefined, not that it has spoiled.",
  },
  {
    slug: "coconut-water-citrus-cooler",
    title: "Coconut water citrus cooler",
    excerpt:
      "Three ingredients, no added sugar. Worth making in a jug on a hot afternoon in Lagos.",
    duration: "5 mins",
    difficulty: "Easy",
    serves: "Serves 2",
    image: "/products/coconut-water-range.jpg",
    usesProducts: ["sana-amnis-coconut-water"],
    ingredients: [
      "2 bottles (500ml) Sana Amnis coconut water, well chilled",
      "Juice of 1 lime, plus a few slices",
      "A small handful of mint",
      "Ice",
    ],
    steps: [
      "Press the mint against the base of a jug with the back of a spoon — enough to bruise it, not to shred it.",
      "Add the lime juice and the coconut water and stir once.",
      "Fill glasses with ice, pour, and finish with a slice of lime.",
    ],
    tip: "Once a bottle is open, keep it refrigerated and drink it within 48 hours. There are no preservatives holding it together.",
  },
];

export const ARTICLES: Article[] = [
  {
    slug: "cold-pressed-vs-hot-pressed",
    title: "Cold-pressed or hot-pressed: which coconut oil do you actually want?",
    excerpt:
      "We make both, and they are genuinely different products. Here is how to choose between them.",
    category: "Guides",
    date: "2026-06-18",
    readingMinutes: 4,
    image: "/products/coconut-oil-cold-pressed.jpg",
    body: [
      {
        paragraphs: [
          "We sell coconut oil two ways, and the labels are not marketing gloss — the extraction method changes what the oil is good for.",
        ],
      },
      {
        heading: "Cold-pressed",
        paragraphs: [
          "Our cold-pressed oil is extracted through a natural fermentation process, with no added heat. Nothing is refined, bleached or deodorised afterwards, which is why it still smells and tastes distinctly of coconut.",
          "That aroma is the point, and also the limitation. It carries into whatever you cook, and it has a lower smoke point than the hot-pressed bottle. Use it where you want to taste it: baking, low and slow cooking, stirring into coffee or porridge, and on skin and hair.",
        ],
      },
      {
        heading: "Hot-pressed",
        paragraphs: [
          "Hot-pressing uses heat to drive a higher yield from the same amount of coconut. The result is a fuller, nuttier oil with a higher smoke point.",
          "This is the one for frying, roasting and everyday Nigerian cooking where you want a neutral, dependable fat that will not scorch.",
        ],
      },
      {
        heading: "The short answer",
        paragraphs: [
          "If it is going on your skin or into something delicate, reach for cold-pressed. If it is going in a hot pan, reach for hot-pressed. If you only want one bottle in the house, hot-pressed is the more versatile of the two.",
        ],
      },
    ],
  },
  {
    slug: "storing-coconut-oil",
    title: "Why your coconut oil went solid, and other storage questions",
    excerpt:
      "Solidified oil is the most common thing customers write to us about. It is not a fault.",
    category: "Guides",
    date: "2026-05-30",
    readingMinutes: 3,
    image: "/products/range-full-light.jpg",
    body: [
      {
        paragraphs: [
          "Coconut oil has a melting point of roughly 24°C. Below that it sets into a firm white solid; above it, it is clear and liquid. Both states are the same oil, and moving between them does it no harm at all.",
        ],
      },
      {
        heading: "Solid is a good sign",
        paragraphs: [
          "Heavily refined oils are often processed in ways that keep them liquid at lower temperatures. Ours is unrefined, so it behaves the way coconut oil naturally does. If your bottle sets hard in an air-conditioned room, that is the oil telling you it has not been messed with.",
          "To use it, stand the closed bottle in warm water for a few minutes, or scoop out what you need and warm it between your palms. Avoid the microwave — it heats unevenly and you lose some of the aroma for no good reason.",
        ],
      },
      {
        heading: "Shelf life",
        paragraphs: [
          "Unopened, our oils keep for 24 months in a cool, dry cupboard away from direct sunlight. Once opened, use a clean dry spoon rather than fingers — water and crumbs are what actually spoil an oil, not time.",
        ],
      },
      {
        heading: "Coconut water is different",
        paragraphs: [
          "Coconut water has no preservatives in it. Unopened it is fine at room temperature until its date, but once you open a bottle or pouch, refrigerate it and drink it within 48 hours.",
        ],
      },
    ],
  },
  {
    slug: "cooking-with-coconut-flour",
    title: "Cooking with coconut flour without wasting a batch",
    excerpt:
      "It behaves nothing like wheat flour. If you swap it one-for-one you will produce something inedible.",
    category: "Guides",
    date: "2026-05-12",
    readingMinutes: 4,
    image: "/products/placeholder.jpg",
    body: [
      {
        paragraphs: [
          "Coconut flour is milled from dried coconut meat. It is naturally gluten-free and very high in fibre — and that fibre makes it extraordinarily thirsty.",
        ],
      },
      {
        heading: "The ratio",
        paragraphs: [
          "As a rough starting point, substitute about a quarter of the wheat flour a recipe calls for, and add an extra egg for every 30g of coconut flour you use. Without the additional egg and liquid you will get something dry and crumbly that falls apart on the plate.",
          "Let any batter stand for five minutes before cooking. It will thicken as the flour absorbs liquid, and judging consistency before that point will mislead you into adding more flour.",
        ],
      },
      {
        heading: "Where it works best",
        paragraphs: [
          "Pancakes, muffins, and coatings for fish and chicken are the most forgiving places to start. It is also a useful thickener for soups and stews.",
          "It is harder work in bread, where gluten normally does the structural job. If you are set on bread, look for a recipe written specifically for coconut flour rather than adapting one.",
        ],
      },
    ],
  },
  {
    slug: "buying-direct-from-farmers",
    title: "What buying direct from farmers actually means for us",
    excerpt:
      "A plain account of how we source, including the parts we have not finished yet.",
    category: "Sourcing",
    date: "2026-04-22",
    readingMinutes: 3,
    image: "/products/range-full-dark.jpg",
    body: [
      {
        paragraphs: [
          "We buy coconuts from local farming families growing organic coconut trees across Nigeria, rather than through the chain of intermediaries that normally sits between a Nigerian farm and a finished product.",
        ],
      },
      {
        heading: "Why it matters commercially",
        paragraphs: [
          "Buying direct means more of what you pay reaches the people growing the fruit. It also means we know which farms our stock came from, which matters when a batch tastes different from the last one and we need to work out why.",
        ],
      },
      {
        heading: "Using the whole fruit",
        paragraphs: [
          "Processing everything in one place is what makes the range possible. The water is bottled first. The meat becomes milk, then powder. What is left is pressed for oil, dried into flakes, or milled into flour and poundo. Husk and shell go back out for fuel and horticultural use.",
        ],
      },
      {
        heading: "What we have not done yet",
        paragraphs: [
          "We do not hold organic certification and we do not claim it. Our coconuts are grown without synthetic pesticide programmes, but certification is a formal process we have not completed.",
          "We also cannot yet publish an audited figure for the share of each sale that reaches farmers. When we can, we will.",
        ],
      },
    ],
  },
];

// Previously lived only inline in src/app/(shop)/faq/page.tsx as JSX (some
// answers embedded real <Link> elements). Extracted here as plain text, with a
// single `[label](/path)` markdown-style link where the original had one — the
// FAQ page renders that syntax back into a real link (see parseFaqAnswer()).
export const FAQS: Faq[] = [
  {
    question: "What is the difference between your cold-pressed and hot-pressed coconut oil?",
    answer:
      "Cold-pressed is extracted through a natural fermentation process, with no added heat, so nothing is refined, bleached or deodorised — it keeps a stronger coconut aroma and a lower smoke point, which suits skin, hair and baking. Hot-pressed uses heat for a higher yield, giving a milder flavour and a higher smoke point, which suits everyday frying and cooking.",
    category: "products",
  },
  {
    question: "Where do you deliver?",
    answer:
      "Nationwide across Nigeria. Lagos orders typically arrive in 24–48 hours; other states take 3–5 working days. Orders above ₦50,000 ship free. See our shipping page for details.",
    category: "shipping",
  },
  {
    question: "Why has my coconut oil gone solid?",
    answer:
      "Coconut oil naturally sets solid below about 24°C and turns liquid again above it — that is normal for an unrefined oil, not a fault. See our [storage guide](/blog/storing-coconut-oil) for how to bring it back to liquid.",
    category: "products",
  },
  {
    question: "Are your products suitable for sensitive skin?",
    answer:
      "Our oils and butters contain no synthetic fragrance, parabens, sulphates or alcohol. As with any natural oil, we would still suggest a small patch test first if you have a known sensitivity.",
    category: "products",
  },
  {
    question: "Can I use your coconut oil for cooking and on my skin?",
    answer:
      "Yes — both are food-grade. Many customers use the same cold-pressed bottle for cooking and for skin and hair. If you are frying regularly, the hot-pressed bottle's higher smoke point will serve you better.",
    category: "products",
  },
  {
    question: "What is your returns policy?",
    answer:
      "Unopened items can be returned within 14 days of delivery for a full refund. For food-safety reasons we cannot accept returns of opened consumables unless the product is faulty. Full details are on our [returns page](/returns).",
    category: "orders",
  },
  {
    question: "Do you sell wholesale or in bulk?",
    answer:
      "Yes — get in touch through our [contact page](/contact) with the quantities you need and we will quote you directly.",
    category: "orders",
  },
];

export function getFaqs(): Faq[] {
  return FAQS;
}

export interface Distributor {
  slug: string;
  region: string;
  /** e.g. "Apo, Garki, Guzape, Gudu, Durumi" — set when a region covers several named areas. */
  areasCovered?: string;
  contactName?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  notes?: string;
}

// Pickup/distributor network as supplied directly by the client. Kept as
// separate entries per region/contact rather than merged, since each has its
// own contact person and, in most cases, its own physical pickup address.
export const DISTRIBUTORS: Distributor[] = [
  {
    slug: "lagos-mainland",
    region: "Lagos Mainland",
    address: "10 Olarenwaju Close, Heritage Estate, Egbeda",
    phone: "08026470045",
  },
  {
    slug: "lagos-island",
    region: "Lagos Island, Lekki, Ajah & environs",
    address: "No 11 Chief Akeem Shobande Street, Thomas Estate, Ajah, Lagos",
    phone: "0813 578 0652",
    whatsapp: "+234 812 407 9806",
  },
  {
    slug: "south-east-south-south",
    region: "South East & South South",
    areasCovered: "Benin, Imo, Onitsha, Aba, Port Harcourt, Enugu and environs",
    address: "6c Orianwo Street, Ogunabali Road, Port Harcourt",
    whatsapp: "08180848530",
  },
  {
    slug: "uyo",
    region: "Uyo and environs",
    contactName: "Mrs Hope",
    phone: "08035311614",
  },
  {
    slug: "abuja-pickup",
    region: "Abuja pickup locations",
    areasCovered: "Apo, Garki, Guzape, Gudu, Durumi",
    contactName: "Mercy Jayeola",
    phone: "08158495170",
    address: "House 75, Marigold Close, Dogongada Village, behind Efab Estate, Lokogoma, Abuja",
  },
];

export function getDistributors(): Distributor[] {
  return DISTRIBUTORS;
}

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Long dates, written the way a Nigerian reader would expect. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
