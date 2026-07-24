"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Loader2,
  ShieldCheck,
  Droplet,
  Truck,
  Play,
  ChevronDown,
  X,
} from "lucide-react";
import ProductInteractiveForm from "./ProductInteractiveForm";
import { ProductHeroGallery } from "./ProductHeroGallery";
import { StickyPurchaseBar } from "./StickyPurchaseBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ds/cards/product-card";
import { RecipeCard } from "@/components/ds/cards/recipe-card";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductDetailClientProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    variants: any[];
  };
}

const MOCK_FAQS = [
  {
    q: "How is Sana Amnis cold-pressed coconut oil different from store brands?",
    a: "Unlike commercial brands that refine, bleach, and deodorize oil under extreme temperatures (200°C+), Sana Amnis uses a zero-heat hydraulic press kept strictly below body temperature (37°C). This preserves 100% of fatty acid polyphenols and natural lauric moisture.",
  },
  {
    q: "What is the shelf life and ideal storage condition?",
    a: "Our raw unrefined oil has a natural shelf life of 24 months. Store in a cool, dry sanctuary away from direct sunlight. Below 24°C (75°F), the oil naturally solidifies into a silky cream—this is proof of pure unrefined extraction.",
  },
  {
    q: "Can this formulation be used for both culinary and skin wellness?",
    a: "Yes. Our extra virgin cold-pressed oil is 100% food-grade organic. It is equally potent for bio-active cooking, smoothie elixirs, skin lipid barrier hydration, and hair follicle conditioning.",
  },
];

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"ingredients" | "nutrition" | "usage" | "shipping">("ingredients");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainFormRef = useRef<HTMLDivElement>(null);

  // Scroll detection for Sticky Purchase Bar
  useEffect(() => {
    const handleScroll = () => {
      if (mainFormRef.current) {
        const rect = mainFormRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load & Save Recently Viewed Items
  useEffect(() => {
    const storedRaw = localStorage.getItem("sana_amnis_recently_viewed");
    let currentList: any[] = [];
    if (storedRaw) {
      try {
        currentList = JSON.parse(storedRaw);
      } catch (e) {
        console.error(e);
      }
    }

    const filtered = currentList.filter((item) => item.slug !== product.slug);
    const updated = [
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: Number(product.variants?.[0]?.price) || 15000,
        imageUrl: product.variants?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400",
        category: product.category,
      },
      ...filtered,
    ].slice(0, 4);

    setRecentlyViewed(filtered.slice(0, 4));
    localStorage.setItem("sana_amnis_recently_viewed", JSON.stringify(updated));

    setReviews([
      {
        name: "Amina Yusuf",
        rating: 5,
        comment: "Exceptional purity and aroma. My skin barrier and hair moisture improved within a week.",
        date: "June 26, 2026",
      },
      {
        name: "Emeka Okafor",
        rating: 5,
        comment: "Flawless packaging in amber glass. Arrived in Victoria Island in 24 hours.",
        date: "June 18, 2026",
      },
    ]);
  }, [product]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: Review = {
        name: reviewerName,
        rating,
        comment,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
      setReviews([newReview, ...reviews]);
      setReviewerName("");
      setComment("");
      setIsSubmitting(false);
    }, 800);
  };

  const images = product.variants?.map((v) => v.imageUrl).filter(Boolean) || [];
  const primaryPrice = Number(product.variants?.[0]?.price) || 15000;
  const primaryImage = product.variants?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800";

  return (
    <div className="space-y-24 py-8 max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 font-sans">
      {/* 1. Hero Landing Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Gallery */}
        <div className="lg:col-span-7">
          <ProductHeroGallery images={images} title={product.title} />
        </div>

        {/* Right Product Form & Specs */}
        <div className="lg:col-span-5 flex flex-col justify-between" ref={mainFormRef}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="gold">{product.category}</Badge>
              <div className="flex items-center gap-1 text-xs text-[#C9A227]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-[#161A17]">4.9</span>
                <span className="text-[#676E6A]">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-medium text-[#161A17] leading-tight">
              {product.title}
            </h1>

            <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Guarantees Bar */}
            <div className="py-4 border-y border-[#E2E6E3] grid grid-cols-3 gap-2 text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#1C3322]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" /> 100% Organic
              </span>
              <span className="flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-[#C9A227]" /> Cold-Pressed
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#C9A227]" /> Express Dispatch
              </span>
            </div>

            {/* Interactive Buy Form */}
            <ProductInteractiveForm
              productId={product.id}
              productTitle={product.title}
              categoryName={product.category}
              variants={product.variants}
            />
          </div>
        </div>
      </div>

      {/* 2. Video & Process Showcase */}
      <section className="relative rounded-[2rem] bg-[#161A17] text-[#FAF8F5] p-8 md:p-16 overflow-hidden border border-gold-hairline shadow-ambient-lg">
        <div className="max-w-3xl space-y-4">
          <Badge variant="gold">HARVESTING FILM</Badge>
          <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight">
            Watch the Badagry Grove Extraction Protocol
          </h2>
          <p className="text-xs md:text-sm text-[#FAF8F5]/80 font-sans leading-relaxed">
            See how fresh coconuts are hand-harvested, cold-pressed within 24 hours, and filtered without heat or hexane.
          </p>
          <Button
            variant="alabaster"
            size="lg"
            onClick={() => setIsVideoModalOpen(true)}
            className="inline-flex items-center gap-3 text-xs"
          >
            <Play className="w-4 h-4 fill-current text-[#C9A227]" /> Watch Documentary Film (2:15)
          </Button>
        </div>
      </section>

      {/* 3. Tabbed Editorial Specifications (Ingredients, Nutrition, Usage, Shipping) */}
      <section className="space-y-8">
        <div className="flex border-b border-[#E2E6E3] overflow-x-auto gap-8 text-xs uppercase tracking-[0.2em] font-sans font-semibold">
          {[
            { id: "ingredients", label: "Botanical Ingredients" },
            { id: "nutrition", label: "Nutrition & Lipid Assay" },
            { id: "usage", label: "How To Use" },
            { id: "shipping", label: "Shipping & Circular Returns" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 border-b-2 transition-colors shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#1C3322] text-[#1C3322]"
                  : "border-transparent text-[#676E6A] hover:text-[#161A17]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] glass-alabaster border border-[#E2E6E3] min-h-[220px]">
          {activeTab === "ingredients" && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl font-medium text-[#161A17]">100% Raw Unrefined Ingredients</h3>
              <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
                Contains only 100% Certified Organic Cold-Pressed Virgin Coconut Oil (Cocos Nucifera). Free from synthetic fragrances, preservatives, parabens, sulfates, and hexane.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="botanical">Single-Origin Badagry</Badge>
                <Badge variant="gold">Zero Hexane</Badge>
                <Badge variant="alabaster">Non-GMO</Badge>
              </div>
            </div>
          )}

          {activeTab === "nutrition" && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-xl font-medium text-[#161A17]">Lipid & Fatty Acid Profile (Per 100g)</h3>
              <table className="w-full text-xs font-sans text-[#161A17] border-collapse">
                <tbody>
                  <tr className="border-b border-[#E2E6E3] py-2">
                    <td className="py-2.5 font-bold">Lauric Acid (C12)</td>
                    <td className="py-2.5 text-right font-serif font-bold text-[#1C3322]">52.4%</td>
                  </tr>
                  <tr className="border-b border-[#E2E6E3] py-2">
                    <td className="py-2.5 font-bold">Caprylic Acid (C8)</td>
                    <td className="py-2.5 text-right font-serif font-bold text-[#1C3322]">8.1%</td>
                  </tr>
                  <tr className="border-b border-[#E2E6E3] py-2">
                    <td className="py-2.5 font-bold">Capric Acid (C10)</td>
                    <td className="py-2.5 text-right font-serif font-bold text-[#1C3322]">6.2%</td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 font-bold">Natural Vitamin E (Tocopherol)</td>
                    <td className="py-2.5 text-right font-serif font-bold text-[#1C3322]">12.5 mg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3]">
                <span className="font-serif text-lg text-[#C9A227] font-bold block mb-1">01. Skin Lipid Hydration</span>
                <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
                  Warm a small pea-sized amount between clean palms and gently press onto damp face or body after showering.
                </p>
              </div>

              <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3]">
                <span className="font-serif text-lg text-[#C9A227] font-bold block mb-1">02. Follicle Conditioning</span>
                <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
                  Apply liberally to scalp and damp hair ends 30 minutes before washing as an intensive pre-shampoo mask.
                </p>
              </div>

              <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3]">
                <span className="font-serif text-lg text-[#C9A227] font-bold block mb-1">03. Bio-Active Culinary</span>
                <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
                  Add one teaspoon to morning coffee or smoothies for sustained MCT brain energy and metabolic support.
                </p>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl font-medium text-[#161A17]">Shipping & Circular Glass Policy</h3>
              <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
                All orders are dispatched in eco-friendly protective packaging. Orders over ₦50,000 qualify for complimentary express courier shipping across Lagos, Abuja, and Port Harcourt.
              </p>
              <div className="p-4 rounded-[1rem] bg-[#1C3322] text-[#FAF8F5] text-xs font-sans flex items-center justify-between">
                <span>Return 5 empty amber bottles for a 250ml Nectar voucher.</span>
                <Badge variant="gold">CIRCULAR GUARANTEE</Badge>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Cross-Linked Recipe Pairings */}
      <section className="space-y-6 pt-12 border-t border-[#E2E6E3]">
        <div className="flex justify-between items-end">
          <div>
            <Badge variant="gold">BOTANICAL PAIRINGS</Badge>
            <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#161A17] mt-1">
              Recipes Formulated With This Oil
            </h3>
          </div>
          <Link href="/recipes" className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#1C3322] hover:text-[#C9A227] transition-colors">
            Explore All Guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecipeCard
            id="r1"
            title="Golden Turmeric & Raw Coconut Elixir"
            slug="golden-turmeric-coconut-elixir"
            prepTime="10 Mins"
            difficulty="Easy"
            ingredientsCount={5}
            description="Anti-inflammatory morning tonic infused with cold-pressed virgin oil, raw ginger, and organic black pepper."
            imageUrl="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600"
          />

          <RecipeCard
            id="r2"
            title="Overnight Hair Follicle Nourishing Treatment"
            slug="overnight-hair-nourishing-treatment"
            prepTime="15 Mins"
            difficulty="Artisanal"
            ingredientsCount={3}
            description="Intensive scalp therapy pairing unrefined coconut lipids with organic rosemary and lavender essential oils."
            imageUrl="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600"
          />
        </div>
      </section>

      {/* 5. FAQ Accordion */}
      <section className="space-y-6 pt-12 border-t border-[#E2E6E3]">
        <div className="text-center max-w-xl mx-auto">
          <Badge variant="gold">SANCTUARY ASSURANCE</Badge>
          <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#161A17] mt-1">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {MOCK_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-[1rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left font-serif text-base font-medium text-[#161A17] flex items-center justify-between cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C9A227] transition-transform duration-300 ${
                    openFaqIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 text-xs text-[#676E6A] font-sans leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Reviews Critique Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-[#E2E6E3]">
        <div className="lg:col-span-4 space-y-6">
          <Badge variant="gold">VERIFIED REVIEWS</Badge>
          <h3 className="font-serif text-2xl font-medium text-[#161A17]">
            Client Critiques
          </h3>

          <form onSubmit={handleReviewSubmit} className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] space-y-4 shadow-ambient-sm">
            <span className="text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-[#161A17]">
              Submit Critique
            </span>

            <div>
              <label className="text-[10px] font-sans uppercase font-semibold text-[#676E6A] block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Amina Yusuf"
                className="w-full p-3 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans outline-none focus:border-[#1C3322]"
              />
            </div>

            <div>
              <label className="text-[10px] font-sans uppercase font-semibold text-[#676E6A] block mb-1">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-3 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans outline-none focus:border-[#1C3322]"
              >
                <option value={5}>5 Stars (Exceptional)</option>
                <option value={4}>4 Stars (Highly Recommended)</option>
                <option value={3}>3 Stars (Satisfactory)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-sans uppercase font-semibold text-[#676E6A] block mb-1">
                Critique Feedback
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your formulation experience..."
                className="w-full p-3 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans outline-none focus:border-[#1C3322] resize-none"
              />
            </div>

            <Button variant="botanical" size="md" type="submit" disabled={isSubmitting} className="w-full py-3">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Review"}
            </Button>
          </form>
        </div>

        {/* Reviews Cards List */}
        <div className="lg:col-span-8 space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] shadow-ambient-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-medium text-sm text-[#161A17]">{r.name}</span>
                <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#676E6A]">{r.date}</span>
              </div>
              <div className="flex gap-1 text-[#C9A227]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <p className="text-xs text-[#676E6A] font-sans leading-relaxed pt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Recently Viewed Formulations */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-[#E2E6E3]">
          <h3 className="font-serif text-2xl font-medium text-[#161A17]">
            Recently Viewed Formulations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                category={item.category || "Cold-Pressed"}
                price={item.price}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
            className="fixed inset-0 bg-[#161A17]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-[1.5rem] overflow-hidden shadow-ambient-lg border border-gold-hairline">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white text-white hover:text-black rounded-full z-10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Badagry Grove Documentary"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Floating Purchase Bar */}
      <StickyPurchaseBar
        title={product.title}
        price={primaryPrice}
        imageUrl={primaryImage}
        onAddToCart={() => {
          if (mainFormRef.current) {
            mainFormRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }}
        isVisible={showStickyBar}
      />
    </div>
  );
}

