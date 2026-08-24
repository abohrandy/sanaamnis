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

export interface CatalogUsageStep {
  title: string;
  description: string;
}

export interface CatalogFaq {
  q: string;
  a: string;
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
  usageSteps: CatalogUsageStep[];
  /** Product-specific FAQs shown on its product page — each product carries its own, rather than one generic list shared by all. */
  faqs?: CatalogFaq[];
  /** Screenshots of real customer reviews (WhatsApp, etc.) shown as a carousel on the product page. */
  reviewImages?: string[];
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
    tagline: "Coconut water, made in Nigeria from home-grown coconuts.",
    description:
      "Coconut water drawn from young green coconuts grown by local farmers across Nigeria. Naturally rich in potassium, magnesium and the electrolyte salts your body loses through heat and exertion. No added sugar, no concentrate, no preservatives — simply the water as it comes from the nut.",
    categorySlug: "hydration",
    images: [
      "/products/coconut-water-range.jpg",
      "/products/coconut-water-pouch-250ml.jpg",
      "/products/coconut-water-bottle-500ml.jpg",
    ],
    badge: "NO ADDED SUGAR",
    usageSteps: [
      { title: "Chilled, straight up", description: "Best served cold, straight from the fridge, as a light everyday drink." },
      { title: "Post-workout", description: "Replace lost electrolytes after exercise or time in the sun instead of a sports drink." },
      { title: "Once opened", description: "Refrigerate and drink within 48 hours — there are no preservatives to extend it." },
    ],
    faqs: [
      {
        q: "Is Sana Amnis Coconut Water natural?",
        a: "Yes. Sana Amnis Coconut Water is made from carefully selected fresh green coconuts, giving you a naturally refreshing drink.",
      },
      {
        q: "Does Sana Amnis Coconut Water contain added sugar?",
        a: "No. We do not add sugar to our coconut water. Its mild sweetness comes naturally from the coconut.",
      },
      {
        q: "Why does the taste sometimes vary?",
        a: "Coconuts are natural fruits, so their sweetness and flavour can vary slightly depending on the season, variety and maturity of the coconut. Slight differences in taste are completely normal.",
      },
      {
        q: "Why does my coconut water sometimes turn pink?",
        a: "Fresh coconut water can sometimes develop a light pink colour due to a natural reaction involving oxygen, light and temperature. A slight pink colour does not automatically mean the coconut water has gone bad.",
      },
      {
        q: "Does Sana Amnis Coconut Water need to be refrigerated?",
        a: "Yes. Sana Amnis Coconut Water should be kept refrigerated, particularly in the freezer compartment. Always follow the storage instructions provided on the product label.",
      },
      {
        q: "How long does Sana Amnis Coconut Water last?",
        a: "It can last for 3 months once stored properly. Please check the Best Before date on your bottle or pouch and follow the recommended storage instructions.",
      },
      {
        q: "How do I know if my coconut water has gone bad?",
        a: "Do not drink the product if it develops an unusual smell or taste, or if the packaging is swollen, leaking or damaged. When in doubt, do not consume it.",
      },
      {
        q: "What sizes of Sana Amnis Coconut Water are available?",
        a: "Our coconut water is available in convenient 250 ml pouches and 500 ml bottles, making it easy to choose the size that works for you.",
      },
      {
        q: "Do you deliver Sana Amnis Coconut Water?",
        a: "Yes. We offer delivery to different locations. Delivery availability, fees and timelines depend on your location. Contact us or use the Order Now button to confirm delivery to your area.",
      },
      {
        q: "Can I buy Sana Amnis Coconut Water in bulk?",
        a: "Yes. We accept bulk orders for homes, offices, events, gyms, restaurants, retailers and other businesses. Contact us for current bulk-order options.",
      },
      {
        q: "Do you supply supermarkets, gyms, restaurants and other retailers?",
        a: "Yes. We welcome wholesale and retail partnerships. If you would like to stock Sana Amnis Coconut Water in your supermarket, store, gym, restaurant, café or other business, please contact us for our supply options.",
      },
      {
        q: "How can I order Sana Amnis Coconut Water?",
        a: "Ordering is easy. Simply click the Order Now button on our website or contact us directly on WhatsApp.",
      },
    ],
    reviewImages: [
      "/reviews/coconut-water-review-1.jpeg",
      "/reviews/coconut-water-review-2.jpeg",
      "/reviews/coconut-water-review-3.jpeg",
      "/reviews/coconut-water-review-4.jpeg",
      "/reviews/coconut-water-review-5.jpeg",
      "/reviews/coconut-water-review-6.jpeg",
    ],
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
    id: "bdc58302-d353-55c5-a193-79d0a265b5a0",
    slug: "coconut-milk-full-cream",
    title: "Full Cream Coconut Milk",
    tagline: "Rich, ready-to-pour coconut milk pressed from fresh mature coconuts.",
    description:
      "A full-cream coconut milk pressed from the meat of mature coconuts and bottled without thickeners or emulsifiers. Pours smooth and stays rich through cooking — built for stews, curries, smoothies and coffee alike.",
    categorySlug: "culinary",
    images: [
      "/products/full-cream-coconut-milk.jpg",
      "/products/full-cream-coconut-milk-range.jpg",
    ],
    usageSteps: [
      { title: "Shake well before use", description: "Natural separation may occur — simply shake well before use each time." },
      { title: "Coconut rice & other rice dishes", description: "Pour directly into your pot while cooking coconut rice, jollof rice or other rice dishes. Use it as part of your cooking liquid and adjust the water according to your recipe." },
      { title: "Oatmeal, pap & breakfast", description: "Use it to prepare oatmeal, pap, custard or breakfast cereals for a creamy coconut flavour — alone, or combined with water depending on your preferred consistency." },
      { title: "Smoothies & shakes", description: "Pour directly into your blender with fruits and other ingredients to create rich, creamy smoothies and shakes." },
      { title: "Soups, stews & sauces", description: "Add it to soups, stews, curries and sauces for extra creaminess and coconut flavour." },
      { title: "Baking", description: "Use it in cakes, pancakes, waffles, muffins, bread and other baked recipes that call for milk or coconut milk." },
      { title: "Desserts", description: "Perfect for puddings, ice cream, parfaits and other homemade desserts." },
      { title: "Tea, coffee & drinks", description: "Add a small amount to tea, coffee, cocoa and other drinks for a creamy coconut twist." },
    ],
    faqs: [
      { q: "What is Sana Amnis Full Cream Coconut Milk?", a: "It is creamy coconut milk made from fresh coconut flesh, ready for you to use in cooking, baking, drinks and desserts." },
      { q: "Do I need to dilute it before use?", a: "Not necessarily. It comes ready to use. You can use it directly or add water when a recipe requires a lighter consistency." },
      { q: "Do I need to cook it before using it?", a: "It depends on what you're making. You can add it directly to foods that will be cooked, or use it in suitable drinks and recipes as directed on the product label." },
      { q: "What can I make with it?", a: "Use it for coconut rice, oatmeal, pap, smoothies, soups, stews, sauces, curries, pancakes, cakes, bread and desserts." },
      { q: "Can I use it for coconut rice?", a: "Absolutely. Coconut rice is one of our favourite ways to use it! Add it as part of the liquid used to cook your rice." },
      { q: "Can I use it in smoothies?", a: "Yes. Pour it directly into your blender with fruits and other smoothie ingredients for a creamy coconut flavour." },
      { q: "Why has my coconut milk separated?", a: "Natural separation is normal. Coconut milk contains coconut fat and water, which may separate while standing. Simply shake well before use." },
      { q: "Does it need to be refrigerated?", a: "Yes. Sana Amnis Full Cream Coconut Milk should be kept refrigerated according to the storage instructions on the bottle." },
      { q: "How should I store it after opening?", a: "Keep it refrigerated after opening and follow the after-opening instructions on the product label. Always close the bottle properly between uses." },
      { q: "How do I know if my coconut milk has gone bad?", a: "Do not use it if you notice an unusual or unpleasant smell, unexpected sour taste, unusual appearance, swollen packaging or other signs of spoilage. When in doubt, don't use it." },
      { q: "What is the difference between Full Cream Coconut Milk and Coconut Milk Powder?", a: "Full Cream Coconut Milk comes already prepared and ready to pour. Coconut Milk Powder is dry and can be mixed with water whenever you need coconut milk, or added directly to certain foods and drinks. Choose full cream for ready-to-use convenience and powder for easy storage and flexibility." },
      { q: "What size is available?", a: "Sana Amnis Full Cream Coconut Milk is available in a convenient 500 ml bottle." },
      { q: "Can I order in bulk?", a: "Yes. Bulk orders are available for homes, restaurants, bakeries, cafés, caterers, hotels and other food businesses." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [
      {
        id: "ee6d9cb0-a0f1-50c2-af4f-1b6c1aa0bef2",
        sku: "SA-CM-500",
        name: "500ml",
        price: 5000,
        stock: 90,
        imageUrl: "/products/full-cream-coconut-milk.jpg",
      },
    ],
  },
  {
    id: "45dd19f8-9d31-5250-a9a7-16d184da7dc4",
    slug: "pure-coconut-milk-powder",
    title: "Coconut Milk Powder",
    tagline: "Coconut milk powder for cooking and baking.",
    description:
      "Fresh coconut milk gently spray-dried into a fine powder that reconstitutes in seconds. Gives you the body of full-cream coconut milk with none of the refrigeration, so it keeps in the cupboard and measures exactly to the spoon. No added sugar.",
    categorySlug: "culinary",
    images: [
      "/products/coconut-milk-powder-supplied.jpg",
      "/products/coconut-milk-powder-sizes.jpg",
      "/products/coconut-milk-powder.jpg",
    ],
    badge: "NEW",
    usageSteps: [
      { title: "Make fresh coconut milk", description: "Mix with clean water and stir or blend until smooth. Adjust the amount of powder or water depending on how light or creamy you want it. Tip: warm water makes mixing easier." },
      { title: "Cook coconut rice", description: "Add the prepared coconut milk to your rice while cooking, or add the powder directly and adjust with water as needed — perfect for coconut rice, jollof rice and other rice dishes." },
      { title: "Upgrade your breakfast", description: "Stir the powder directly into oatmeal, pap, custard, breakfast cereals or pancake and waffle batter for an easy creamy coconut taste." },
      { title: "Blend into smoothies & shakes", description: "Add a spoonful directly to your favourite smoothie or shake for creaminess and coconut flavour, without needing to prepare liquid coconut milk first." },
      { title: "Add to tea, coffee & drinks", description: "Use it as a convenient coconut-based creamer for tea, coffee, cocoa and other drinks. Add a little at a time and adjust to your preferred creaminess." },
      { title: "Cook soups, stews & sauces", description: "Mix with water or add directly to soups, stews, curries and sauces. Use more powder when you want a thicker, richer, creamier result." },
      { title: "Bake with it", description: "Add to cakes, bread, pancakes, waffles, cookies and muffins — mix it with the dry ingredients or prepare it as coconut milk first, depending on your recipe." },
      { title: "Make desserts", description: "Perfect for adding coconut flavour and creaminess to puddings, ice cream, parfaits and other homemade treats." },
    ],
    faqs: [
      { q: "What is Sana Amnis Coconut Milk Powder?", a: "Sana Amnis Coconut Milk Powder is a convenient powdered form of coconut milk that can be mixed with water or added directly to foods and drinks." },
      { q: "How do I prepare coconut milk from the powder?", a: "Simply mix the powder with clean water and stir or blend until smooth. You can adjust the amount of water depending on how light or creamy you want your coconut milk. Tip: warm water makes mixing easier." },
      { q: "Can I use the powder without mixing it with water?", a: "Yes! You can add it directly to tea, coffee, oatmeal, pap, smoothies, sauces, soups and some recipes." },
      { q: "What can I make with Sana Amnis Coconut Milk Powder?", a: "Lots of things! Use it for coconut rice, smoothies, oatmeal, pap, tea, coffee, pancakes, cakes, bread, soups, sauces, curries and desserts." },
      { q: "What is the difference between Coconut Milk Powder and Sana Amnis Full Cream Coconut Milk?", a: "Our Full Cream Coconut Milk comes ready to use in liquid form. Our Coconut Milk Powder is dry, easy to store and lets you prepare just the quantity of coconut milk you need. Both give you delicious coconut flavour — the choice depends on convenience and how you plan to use them." },
      { q: "Can I use it as a creamer for tea or coffee?", a: "Yes. Simply add a little directly to your tea, coffee or cocoa and stir well. Adjust the quantity to your preferred level of creaminess." },
      { q: "Can I use it for coconut rice?", a: "Absolutely. Prepare it as coconut milk and use it as part of your cooking liquid, or add the powder directly while cooking and adjust the water accordingly." },
      { q: "Can I use it for baking?", a: "Yes. Sana Amnis Coconut Milk Powder can be used in cakes, pancakes, waffles, muffins, bread and other baked recipes." },
      { q: "Why does my coconut milk powder sometimes form lumps?", a: "Powder can clump when exposed to moisture or when added too quickly to liquid. For smoother mixing, gradually add the powder to warm water while stirring or blending." },
      { q: "How should I store the powder?", a: "Keep it properly sealed in a cool, dry place away from moisture and direct sunlight. Always use a clean, dry spoon when scooping the powder." },
      { q: "How long does it last after opening?", a: "Always follow the storage instructions on the pack and use it within the recommended period after opening. Keep the pack tightly sealed between uses." },
      { q: "What sizes are available?", a: "Sana Amnis Coconut Milk Powder is available in different pack sizes, so you can choose the quantity that suits your household or business needs." },
      { q: "Can I buy it in bulk?", a: "Yes. Bulk and wholesale orders are available for homes, bakeries, cafés, restaurants, caterers, retailers and other businesses. Contact us for current options." },
      { q: "How can I order?", a: "Simply click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [
      { id: "6d396826-aed2-5b9a-a316-efcc7b8ae204", sku: "SA-CMP-100", name: "100g", price: 5000, stock: 80, imageUrl: "/products/coconut-milk-powder-supplied.jpg" },
      { id: "35763316-68a3-5d4d-8a47-1dcc3aff35d8", sku: "SA-CMP-500", name: "500g", price: 22000, stock: 60, imageUrl: "/products/coconut-milk-powder-sizes.jpg" },
      { id: "b96b58bf-56ee-5618-88b5-c9f68ff72028", sku: "SA-CMP-1000", name: "1kg", price: 42000, stock: 40, imageUrl: "/products/coconut-milk-powder.jpg" },
    ],
  },
  {
    id: "e3c718b9-a87d-5fc0-960c-5227539674b4",
    slug: "coconut-oil",
    title: "Coconut Oil",
    tagline: "Cold Press and Hot Press coconut oil for cooking.",
    description:
      "Coconut oil made in Nigeria from home-grown coconuts, extracted through a natural fermentation process so none of the lauric acid or natural polyphenols are cooked away. Unrefined, unbleached, hexane-free and fortified with vitamin A.\n\nWe also have hot pressed coconut oil that is produced through heat extraction and it can be used for cooking and skincare too.",
    categorySlug: "culinary",
    extraCategorySlugs: ["body"],
    images: [
      "/products/coconut-oil-cold-pressed.jpg",
      "/products/coconut-oil-cold-pressed-100ml.jpg",
      "/products/coconut-oil-cold-pressed-500ml.jpg",
      "/products/coconut-oil-cold-pressed-1l.jpg",
      "/products/coconut-oil-hot-pressed.jpg",
    ],
    badge: "COLD + HOT PRESS",
    usageSteps: [
      { title: "Cooking", description: "Use for frying, sautéing and preparing everyday meals. It can also be used to grease pans and baking trays." },
      { title: "Baking", description: "Use in cakes, cookies, bread, pancakes and other baked recipes as an alternative cooking fat with a subtle coconut character." },
      { title: "Rice & other meals", description: "Add a small amount while preparing rice, sauces, vegetables and other dishes for extra coconut flavour and aroma." },
      { title: "Smoothies & foods", description: "A small amount can be incorporated into suitable smoothies, oatmeal and other recipes according to your preference." },
      { title: "Skin care", description: "Apply a small amount to the skin and massage gently. Use as a body oil or moisturising oil, particularly on dry areas." },
      { title: "Hair care", description: "Apply a small amount directly to the hair or scalp, or use it as a pre-shampoo hair oil or hot-oil treatment." },
      { title: "Nails & cuticles", description: "Massage a small amount into your nails and cuticles as part of your regular hand-care routine." },
    ],
    faqs: [
      { q: "What is Sana Amnis Coconut Oil?", a: "Sana Amnis Coconut Oil is oil extracted from coconut and available in cold-pressed and hot-pressed varieties for cooking and other everyday uses." },
      { q: "What is the difference between hot-pressed and cold-pressed coconut oil?", a: "The main difference is the extraction process. Cold-pressed coconut oil is produced using methods that minimise heat during extraction, while hot-pressed coconut oil uses heat as part of the extraction process. This can result in differences in aroma, flavour, colour and overall coconut character." },
      { q: "Which is better: cold-pressed or hot-pressed coconut oil?", a: "Neither is automatically \"better\" — it depends on how you want to use it. For customers who prefer a less heat-processed oil and more natural coconut character, cold-pressed is a good choice. For everyday cooking and frying, hot-pressed is a practical option." },
      { q: "Can I cook with Sana Amnis Coconut Oil?", a: "Yes. Coconut oil can be used for cooking, sautéing, frying and baking." },
      { q: "Can I use Cold-Pressed Coconut Oil for cooking?", a: "Yes. Cold-pressed coconut oil can be used in cooking, particularly when its coconut flavour and aroma complement the meal." },
      { q: "Can I use coconut oil on my skin?", a: "Yes. A small amount can be applied to the skin as part of your moisturising routine. If you have sensitive or acne-prone skin, consider testing a small area first." },
      { q: "Can I use coconut oil on my hair?", a: "Yes. It can be applied to the hair or used as part of a pre-shampoo, conditioning or hot-oil routine." },
      { q: "Why has my coconut oil become solid?", a: "This is normal. Coconut oil naturally changes between liquid and solid states depending on temperature. Becoming solid does not mean the oil has gone bad." },
      { q: "How do I make solid coconut oil liquid again?", a: "Place the tightly closed container in warm water for a few minutes until the oil liquefies. Avoid introducing water into the oil." },
      { q: "How should I store Sana Amnis Coconut Oil?", a: "Keep it properly closed in a cool, dry place away from direct sunlight, heat and moisture. Always use a clean, dry utensil when necessary." },
      { q: "Does coconut oil need to be refrigerated?", a: "Generally, refrigeration is not necessary when coconut oil is stored correctly. Follow the specific storage instructions provided on your Sana Amnis product label." },
      { q: "How long does it last?", a: "Check the Best Before date on the product packaging and follow the recommended storage instructions." },
      { q: "What sizes are available?", a: "Sana Amnis Coconut Oil is available in different sizes, making it easy to choose an option for personal, household or business use." },
      { q: "Can I order coconut oil in bulk?", a: "Yes. Bulk and wholesale orders are available for homes, restaurants, bakeries, retailers, salons and other businesses." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [
      { id: "8b1ea61d-8b9f-55b9-9a39-0909eff7765a", sku: "SA-CO-CP-100", name: "Cold Press · 100ml", price: 3000, stock: 80, imageUrl: "/products/coconut-oil-cold-pressed-100ml.jpg" },
      { id: "0cc58ae1-3e61-5aa7-a8b3-c7aaaaf6f4fe", sku: "SA-CO-CP-200", name: "Cold Press · 200ml", price: 6000, stock: 70, imageUrl: "/products/coconut-oil-cold-pressed-100ml.jpg" },
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
    description:
      "A rich blend of carrot infused into our own coconut oil, carrying the beta-carotene and natural vitamin A that carrots are prized for. Traditionally used to even skin tone and add warmth and shine to hair.",
    categorySlug: "body",
    images: ["/products/carrot-oil.jpg", "/products/carrot-oil-lifestyle.jpg"],
    usageSteps: [
      { title: "For your skin", description: "Apply a few drops to clean, slightly damp skin and massage gently. Use alone or add a few drops to your favourite body lotion or cream." },
      { title: "For your hair", description: "Apply a small amount to your hair and scalp and massage gently. It can also be added to your conditioner or used as part of a hot-oil treatment." },
      { title: "For dry areas", description: "Massage a small amount into dry areas such as the elbows, knees, hands and feet whenever needed. Tip: a little goes a long way. For external use only." },
    ],
    faqs: [
      { q: "What is Sana Amnis Carrot Oil used for?", a: "It can be used as part of your regular skin and hair-care routine to moisturise and condition." },
      { q: "Can I use it every day?", a: "Yes. Apply a small amount as needed, depending on your skin or hair type." },
      { q: "Can I use it on my face?", a: "Yes, but facial skin varies. Start with a small amount and patch-test first, particularly if you have sensitive or acne-prone skin." },
      { q: "Can I mix it with my body cream?", a: "Yes. Add a few drops to your lotion or body cream before applying." },
      { q: "Can I use it on my hair?", a: "Yes. Apply sparingly to the hair or scalp, or incorporate it into your regular hair-care routine." },
      { q: "Is carrot oil a sunscreen?", a: "No. Carrot oil should not replace sunscreen. Use an appropriate broad-spectrum sunscreen for sun protection." },
      { q: "How should I store it?", a: "Keep tightly closed in a cool, dry place away from direct sunlight and heat." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [
      { id: "56b330c6-eff3-5f63-ad43-919d1358de2e", sku: "SA-CRT-100", name: "100ml", price: 3500, stock: 70, imageUrl: "/products/carrot-oil.jpg" },
      { id: "1cc01abb-1d7a-5b1e-9c02-18c774d67349", sku: "SA-CRT-200", name: "200ml", price: 7000, stock: 50, imageUrl: "/products/carrot-oil-lifestyle.jpg" },
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
    images: ["/products/avococo-oil.jpg", "/products/avococo-oil-trio.jpg"],
    usageSteps: [
      { title: "For your skin", description: "Apply a few drops to clean, slightly damp skin and massage gently. You can also mix a few drops into your body lotion or cream." },
      { title: "For your hair", description: "Apply a small amount to your hair and scalp. Massage gently or use as part of your pre-shampoo or hot-oil routine." },
      { title: "For dry areas", description: "Massage into dry areas such as your elbows, knees, hands and feet whenever needed. Tip: a little goes a long way. For external use only." },
    ],
    faqs: [
      { q: "What is Avococo Oil?", a: "Sana Amnis Avococo Oil is a blend of avocado oil and coconut oil, created for everyday skin and hair care." },
      { q: "Can I use Avococo Oil every day?", a: "Yes. Apply a small amount as needed depending on your skin or hair type." },
      { q: "Can I use it on my face?", a: "Yes, but skin types differ. Patch-test first and use sparingly, especially if you have sensitive or acne-prone skin." },
      { q: "Can I mix it with my body cream?", a: "Yes. Add a few drops to your favourite lotion or body cream for extra moisturising." },
      { q: "Can I use it on my hair?", a: "Yes. Use it to moisturise your hair, massage your scalp or as part of a pre-shampoo or hot-oil treatment." },
      { q: "How should I store it?", a: "Keep tightly closed in a cool, dry place away from direct sunlight and heat." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [{ id: "f1eeee32-20fe-54bd-b758-424ed7cd2e62", sku: "SA-AVC-100", name: "100ml", price: 4500, stock: 70, imageUrl: "/products/avococo-oil.jpg" }],
  },
  {
    id: "e9d0e6d4-d4e9-514a-9960-4d7889609c32",
    slug: "coconut-lip-balm",
    title: "Lip Balm",
    tagline: "A coconut oil, beeswax and vitamin E balm.",
    description:
      "Our coconut oil in its most portable form. A small, smooth balm that melts on contact to seal moisture into dry or cracked lips, with no synthetic fragrance and nothing that tastes of plastic.",
    categorySlug: "body",
    images: [
      "/products/lip-balm.jpg",
      "/products/lip-balm-range.jpg",
      "/products/lip-balm-lifestyle.jpg",
      "/products/lip-balm-closeup.jpg",
    ],
    usageSteps: [
      { title: "Apply & moisturise", description: "Apply a thin layer directly to clean lips whenever they feel dry." },
      { title: "Use throughout the day", description: "Reapply as needed, especially after eating or drinking." },
      { title: "Overnight lip care", description: "Apply before bedtime to keep your lips moisturised overnight. Tip: keep your lip balm handy for easy everyday lip care." },
    ],
    faqs: [
      { q: "What is Sana Amnis Coconut Oil Lip Balm used for?", a: "It helps moisturise and soften dry lips and protect them from moisture loss." },
      { q: "Can I use it every day?", a: "Yes. Use it daily and reapply whenever your lips need extra moisture." },
      { q: "Can I use it overnight?", a: "Absolutely. Apply before bedtime as part of your night-time lip-care routine." },
      { q: "Can I wear it under lipstick?", a: "Yes. Apply a light layer and allow it to absorb before applying your lipstick." },
      { q: "Does it treat dark lips?", a: "The lip balm is designed primarily to moisturise and condition the lips. It should not be considered a treatment for lip pigmentation." },
      { q: "Does it contain SPF?", a: "Unless SPF protection is specifically stated on the product label, do not rely on it as a sunscreen." },
      { q: "How should I store it?", a: "Keep it properly closed in a cool, dry place away from direct sunlight and excessive heat." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [{ id: "e7cd0526-945d-57ee-bc22-a67a1e56fe86", sku: "SA-LIP-05", name: "5g", price: 1500, stock: 200, imageUrl: "/products/lip-balm.jpg" }],
  },
  {
    id: "966a4c2f-188b-5635-8e33-b7a6adde6122",
    slug: "coconut-flakes",
    title: "Coconut Flakes",
    tagline: "Dehydrated coconut for snacking and baking.",
    description:
      "Broad flakes of coconut meat dehydrated until crisp, with nothing added. Eat them straight from the pouch as a snack, scatter them over granola and yoghurt, or fold them into baking for texture.",
    categorySlug: "culinary",
    images: ["/products/coconut-flakes.jpg"],
    usageSteps: [
      { title: "Enjoy as a snack", description: "Eat straight from the pack for a delicious coconut snack — perfect for your handbag, lunchbox, office drawer or those moments when you simply want something crunchy." },
      { title: "Add to breakfast", description: "Sprinkle over oatmeal, pap, cereal, granola, yoghurt or smoothie bowls for an easy way to add coconut flavour and crunch to breakfast." },
      { title: "Top your smoothies", description: "Sprinkle over smoothies or smoothie bowls for a delicious finishing touch and extra texture." },
      { title: "Baking", description: "Add to cakes, cookies, muffins, bread and other baked treats — mix into your batter or use as a topping." },
      { title: "Desserts", description: "Use as a topping for ice cream, yoghurt, parfaits, puddings and fruit bowls." },
      { title: "Pancakes & waffles", description: "Sprinkle over pancakes and waffles or add some to the batter for a coconutty twist." },
      { title: "Get creative", description: "Combine with nuts, seeds, dried fruits or granola to create your own snack mix, or use to decorate cakes and other homemade treats." },
    ],
    faqs: [
      { q: "What are Sana Amnis Coconut Flakes?", a: "They are coconut pieces prepared into thin, crunchy flakes that can be eaten as a snack or added to foods, breakfast and desserts." },
      { q: "Are they ready to eat?", a: "Yes. Sana Amnis Coconut Flakes are ready to eat straight from the pack. No cooking or preparation is required." },
      { q: "What can I eat coconut flakes with?", a: "Try them with oatmeal, yoghurt, cereal, granola, smoothies, pancakes, waffles, ice cream, fruit bowls and desserts — or simply enjoy them on their own!" },
      { q: "Can I use coconut flakes for baking?", a: "Absolutely. Add them to cakes, cookies, muffins, bread and other baked recipes, or sprinkle them on top before or after baking as appropriate." },
      { q: "What is the difference between coconut flakes and desiccated coconut?", a: "The main difference is size and texture. Coconut Flakes are larger pieces of coconut with a more noticeable bite and crunch. Desiccated Coconut is more finely shredded or grated, making it particularly useful for baking, coatings and recipes where you want coconut distributed throughout the food." },
      { q: "Can children eat Sana Amnis Coconut Flakes?", a: "They can be enjoyed by children who are old enough to safely chew the texture. Always supervise younger children and choose foods appropriate for their age and chewing ability." },
      { q: "Can I add coconut flakes to smoothies?", a: "Yes. You can blend them into your smoothie or sprinkle them on top for extra texture." },
      { q: "Can I use them as a topping?", a: "Definitely! They're great for topping yoghurt, oatmeal, smoothie bowls, pancakes, waffles, cakes, ice cream and desserts." },
      { q: "How should I store Sana Amnis Coconut Flakes?", a: "Keep the pack properly sealed in a cool, dry place away from moisture and direct sunlight." },
      { q: "How do I keep my coconut flakes crunchy after opening?", a: "Close the pack tightly after every use and keep moisture away. Always use clean, dry hands or utensils when taking flakes from the pack." },
      { q: "How long do they last?", a: "Check the Best Before date on the pack and follow the storage instructions provided on the packaging." },
      { q: "What sizes are available?", a: "Sana Amnis Coconut Flakes are available in different convenient pack sizes for snacking, home use and larger requirements." },
      { q: "Can I order in bulk?", a: "Yes. Bulk and wholesale orders are available for homes, bakeries, cafés, restaurants, hotels, caterers, retailers and other businesses." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [
      { id: "0f786e66-cfdc-5574-a16d-c11ce804d127", sku: "SA-FLK-50", name: "50g", price: 1500, stock: 120, imageUrl: "/products/coconut-flakes.jpg" },
      { id: "88320a11-2f30-53f7-856b-7534375df355", sku: "SA-FLK-100", name: "100g", price: 2500, stock: 100, imageUrl: "/products/coconut-flakes.jpg" },
      { id: "79397f01-50da-5ee1-859e-b42e475d1492", sku: "SA-FLK-500", name: "500g", price: 10000, stock: 60, imageUrl: "/products/coconut-flakes.jpg" },
      { id: "9a830966-577b-5145-95e9-f15e18dd87ac", sku: "SA-FLK-1000", name: "1kg", price: 20000, stock: 40, imageUrl: "/products/coconut-flakes.jpg" },
    ],
  },
  {
    id: "5c3d75d5-8c2b-5e5f-bb0a-c4a4e760c6b6",
    slug: "desiccated-coconut",
    title: "Desiccated Coconut",
    tagline: "Fine desiccated coconut for baking and everyday cooking.",
    description:
      "Fine desiccated coconut made from coconut meat for baking, smoothies, rice dishes and meal toppings.",
    categorySlug: "culinary",
    images: [
      "/products/desiccated-coconut.jpg",
      "/products/desiccated-coconut-single.jpg",
      "/products/desiccated-coconut-range.jpg",
      "/products/desiccated-coconut-styled.jpg",
    ],
    usageSteps: [
      { title: "Baking", description: "Add directly to cakes, cookies, muffins, bread and pastries for delicious coconut flavour and texture. Simply mix the required quantity into your batter or dough." },
      { title: "Cookies & coconut treats", description: "Perfect for making coconut cookies, macaroons, coconut bars and other homemade treats." },
      { title: "Decorating cakes & desserts", description: "Sprinkle over cakes, cupcakes, doughnuts and desserts for an easy coconut finish, or use it to coat the sides of frosted cakes." },
      { title: "Coating & rolling", description: "Use to coat energy bites, chocolate treats, date balls and other homemade snacks — simply roll your prepared treats in the coconut until evenly coated." },
      { title: "Breakfast topping", description: "Sprinkle over oatmeal, yoghurt, cereal, granola, smoothie bowls or fruit bowls for a simple way to add coconut flavour and texture." },
      { title: "Pancakes & waffles", description: "Mix some directly into your batter, or sprinkle it over the finished meal." },
      { title: "Desserts", description: "Add to puddings, parfaits, ice cream and other desserts, or use it as a finishing topping." },
    ],
    faqs: [
      { q: "What is desiccated coconut?", a: "Desiccated coconut is coconut flesh that has been finely shredded or grated and dried to reduce its moisture content." },
      { q: "Is Sana Amnis Desiccated Coconut ready to use?", a: "Yes. It is ready to add directly to your baking, breakfast, desserts and other recipes." },
      { q: "Do I need to cook it before using it?", a: "No. It can be used directly from the pack in recipes or as a topping. You can also cook or bake with it depending on what you're making." },
      { q: "What can I make with desiccated coconut?", a: "You can use it for cakes, cookies, bread, muffins, macaroons, coconut bars, pancakes, granola, energy bites and desserts." },
      { q: "What is the difference between desiccated coconut and coconut flakes?", a: "The main difference is size and texture. Desiccated Coconut is more finely shredded or grated, making it easy to mix throughout recipes or use as a coating. Coconut Flakes are larger pieces with a more noticeable bite and crunch, making them particularly good for snacking and toppings." },
      { q: "Can I use desiccated coconut for baking?", a: "Absolutely. Baking is one of the easiest ways to use it. Add it directly to your cake, cookie, bread, muffin or pastry mixture." },
      { q: "Can I use it to decorate cakes?", a: "Yes. Sprinkle it over cakes and cupcakes or use it to coat frosted cakes for a beautiful coconut finish." },
      { q: "Can I use it as a topping?", a: "Yes. Sprinkle it over oatmeal, yoghurt, cereal, smoothies, pancakes, waffles, fruit or desserts." },
      { q: "Can I toast desiccated coconut?", a: "Yes. You can lightly toast it to create a deeper flavour and slightly crispier texture. Watch it closely while toasting because finely shredded coconut can brown quickly." },
      { q: "How should I store it?", a: "Keep Sana Amnis Desiccated Coconut properly sealed in a cool, dry place away from moisture and direct sunlight." },
      { q: "How do I keep it fresh after opening?", a: "Reseal the pack properly after every use and always use a clean, dry spoon or utensil. Avoid allowing moisture into the pack." },
      { q: "How long does it last?", a: "Check the Best Before date on the pack and follow the storage instructions provided on the packaging." },
      { q: "Can I order in bulk?", a: "Yes. Bulk and wholesale orders are available for bakeries, restaurants, cafés, caterers, hotels, retailers and households." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [
      { id: "a8a768da-08b0-502c-b3ff-82d2f04d324c", sku: "SA-DES-100", name: "100g", price: 2000, stock: 90, imageUrl: "/products/desiccated-coconut.jpg" },
    ],
  },
  {
    id: "348c9791-20f1-5f88-956b-bcda6ea8a38b",
    slug: "coconut-poundo",
    title: "Coconut Poundo",
    tagline: "A coconut-based swallow for the kitchen.",
    description:
      "Made from coconut, mixed and moulded exactly as you would poundo yam and higher in fibre than any other flour, and eaten with the same soups. Far lower in carbohydrate than yam or cassava flour, which makes it a genuine option for anyone managing blood sugar without giving up swallow.",
    categorySlug: "culinary",
    images: ["/products/coconut-poundo.jpg", "/products/coconut-poundo-pair.jpg"],
    usageSteps: [
      { title: "Bring water to a boil", description: "Bring clean water to a boil, then reduce the heat." },
      { title: "Add the powder gradually", description: "Gradually add Sana Amnis Coconut Poundo while stirring continuously — it absorbs water quickly, so add it a little at a time." },
      { title: "Stir until smooth", description: "Keep stirring until it becomes smooth and reaches your preferred swallow consistency. Add a little hot water if needed and continue stirring." },
      { title: "Serve warm", description: "Serve warm with your favourite soup." },
      { title: "What can I eat it with?", description: "Enjoy with your favourite soups, including egusi, okra, vegetable soup, ogbono, oha, afang, banga, bitterleaf soup, ewedu and many more." },
    ],
    faqs: [
      { q: "What is Sana Amnis Coconut Poundo?", a: "Sana Amnis Coconut Poundo is a high-fibre swallow made from coconut flour and psyllium husk, created as an alternative way to enjoy your favourite soups." },
      { q: "Is Coconut Poundo the same as coconut flour?", a: "No. Coconut Flour is a versatile flour that can be used for baking, pancakes, smoothies and other recipes. Coconut Poundo is specially formulated as a swallow and contains coconut flour combined with psyllium husk." },
      { q: "How do I prepare Coconut Poundo?", a: "Gradually add the powder to hot water while stirring continuously until smooth. Adjust the water or powder until you achieve your preferred swallow consistency." },
      { q: "Why does Coconut Poundo absorb so much water?", a: "Both coconut flour and psyllium are naturally rich in fibre and absorb water readily. For this reason, add the powder gradually when preparing your swallow." },
      { q: "What does Coconut Poundo taste like?", a: "It has a mild coconut character that pairs well with a wide variety of Nigerian soups." },
      { q: "What soups can I eat with Coconut Poundo?", a: "Almost any soup you normally enjoy with swallow. Try it with egusi, vegetable, okra, ogbono, oha, afang, banga, bitterleaf or ewedu." },
      { q: "Is Sana Amnis Coconut Poundo high in fibre?", a: "Yes. It is made from coconut flour and psyllium husk, both naturally rich sources of dietary fibre." },
      { q: "Can I eat Coconut Poundo if I'm trying to manage my weight?", a: "Coconut Poundo can be incorporated into a balanced diet, particularly when you want a high-fibre swallow option. However, weight management depends on your overall diet, portion size, physical activity and lifestyle, rather than any single food." },
      { q: "Is Coconut Poundo gluten-free?", a: "Coconut and psyllium do not naturally contain gluten. If you need to avoid gluten for medical reasons, check the product label for information about processing and possible cross-contact." },
      { q: "Why is drinking enough water important when eating Coconut Poundo?", a: "Coconut Poundo contains a significant amount of fibre, including psyllium, which absorbs water. It is therefore important to maintain adequate fluid intake as part of a high-fibre diet." },
      { q: "How should I store Sana Amnis Coconut Poundo?", a: "Keep it tightly sealed in a cool, dry place away from moisture and direct sunlight. Always use a clean, dry spoon or scoop." },
      { q: "How long does it last?", a: "Check the Best Before date on the pack and follow the storage instructions provided on the packaging." },
      { q: "Can I order in bulk?", a: "Yes. Bulk and wholesale orders are available for homes, retailers, supermarkets, restaurants and other businesses." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [{ id: "001b416d-98cc-567f-abae-53fef4c8330c", sku: "SA-PND-750", name: "750g", price: 6500, stock: 60, imageUrl: "/products/coconut-poundo.jpg" }],
  },
  {
    id: "39d0690d-6616-5f09-b2ef-f0b44d2b152b",
    slug: "raw-coconut-flour",
    title: "Coconut Flour",
    tagline: "Fine coconut flour for baking and cooking.",
    description:
      "Coconut meat milled to a fine, soft flour. Naturally gluten-free and very high in fibre, so it drinks up considerably more liquid than wheat flour — worth accounting for when you adapt a recipe. Suits keto and paleo baking.",
    categorySlug: "culinary",
    images: ["/products/coconut-flour.jpg", "/products/coconut-flour-single.jpg"],
    usageSteps: [
      { title: "Pancakes & waffles", description: "Add to your batter, either using a recipe developed for coconut flour or combining a small amount with your regular flour for more fibre and a subtle coconut flavour." },
      { title: "Bread", description: "Use in homemade bread and other baked recipes, either as part of a flour blend or in recipes specifically developed for coconut flour." },
      { title: "Cakes & muffins", description: "Works well in cakes, cupcakes and muffins. For best results, use a recipe designed for coconut flour, as it absorbs considerably more liquid than wheat flour." },
      { title: "Cookies & healthy treats", description: "Use for cookies, snack bars and other homemade treats. Pair with the appropriate amount of liquid and binding ingredients according to your recipe." },
      { title: "Add more fibre to breakfast", description: "Add a small amount to oatmeal, smoothies or suitable breakfast recipes for an easy fibre boost. Start with a little and adjust gradually — it thickens quickly." },
      { title: "Thickening soups & sauces", description: "A small amount can be used to thicken suitable soups, sauces and stews. Add gradually while stirring until you reach your preferred consistency." },
      { title: "Coating foods", description: "Can also be used as part of a coating for chicken, fish, vegetables and other foods before cooking." },
      { title: "Important baking tip", description: "Coconut flour is not a 1:1 replacement for wheat flour — it is highly absorbent and requires more liquid. Start with a recipe designed for coconut flour, or add it gradually to your usual recipe, let the mixture sit briefly to absorb the liquid, then add more liquid if it's too thick." },
    ],
    faqs: [
      { q: "What is Sana Amnis Coconut Flour?", a: "It is a flour made from dried coconut flesh that has been finely milled. It has a mild coconut character and is naturally high in fibre." },
      { q: "What can I make with coconut flour?", a: "You can use it for pancakes, waffles, bread, cakes, muffins, cookies, snack bars and other recipes. It can also be added in small amounts to smoothies, oatmeal, soups and sauces." },
      { q: "Can I replace wheat flour completely with coconut flour?", a: "Not usually. Coconut flour absorbs much more liquid than wheat flour, so replacing wheat flour with the same quantity of coconut flour can make your recipe too dry or dense. For best results, use a recipe specifically developed for coconut flour." },
      { q: "Can I mix coconut flour with regular flour?", a: "Yes. You can incorporate a small amount into your regular flour mixture when making pancakes, waffles, bread and other baked foods. This is also an easy way for beginners to start using coconut flour." },
      { q: "Why does coconut flour absorb so much liquid?", a: "Coconut flour is naturally very high in fibre, which makes it highly absorbent. This is why coconut-flour recipes usually require more liquid than recipes using conventional flour." },
      { q: "Why did my coconut flour recipe turn out dry?", a: "You may have used too much coconut flour or not enough liquid. Because it absorbs liquid quickly, even a small increase in coconut flour can significantly change the texture of your recipe." },
      { q: "Is Sana Amnis Coconut Flour high in fibre?", a: "Yes. Coconut flour is naturally rich in dietary fibre, making it an easy way to add more fibre to suitable meals and recipes." },
      { q: "Is coconut flour gluten-free?", a: "Coconut itself does not naturally contain gluten. If you need to avoid gluten for medical reasons, however, check the product label for information about processing and possible cross-contact." },
      { q: "Can I use coconut flour for weight loss?", a: "Coconut flour is high in fibre and can be incorporated into a balanced diet, but no single food causes weight loss. Your overall diet, portion sizes and lifestyle are what matter most." },
      { q: "Can I add coconut flour to smoothies?", a: "Yes. Start with a small amount, blend well and allow it to thicken before deciding whether you need more." },
      { q: "How should I store Sana Amnis Coconut Flour?", a: "Keep it properly sealed in a cool, dry place away from moisture and direct sunlight. Always use a clean, dry spoon when scooping from the pack." },
      { q: "How long does it last?", a: "Check the Best Before date on the pack and follow the storage instructions provided on the packaging." },
      { q: "Can I order in bulk?", a: "Yes. Bulk and wholesale orders are available for homes, bakeries, cafés, restaurants, caterers, retailers and other food businesses." },
      { q: "How can I order?", a: "Click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
    variants: [{ id: "069d43aa-fbd7-549e-ba77-2fe5745d87cf", sku: "SA-FLR-750", name: "750g", price: 6000, stock: 75, imageUrl: "/products/coconut-flour.jpg" }],
  },
];

export const FEATURED_SLUGS = [
  "sana-amnis-coconut-water",
  "coconut-oil",
  "pure-coconut-milk-powder",
  "coconut-flakes",
] as const;

export function getCategory(slug: CategorySlug): CatalogCategory { return CATEGORIES[slug]; }
/**
 * Never throws — a DB product's category comes from the admin's free-form
 * Categories CRUD, which can create a slug this module doesn't know about yet
 * (as "oils" did, crashing every page that read CATEGORIES[slug].name on an
 * unrecognised value). Falls back to a readable label from the slug itself.
 */
export function categoryOrFallback(slug: string): CatalogCategory {
  return (CATEGORIES as Record<string, CatalogCategory>)[slug] ?? {
    id: slug,
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
  };
}
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
