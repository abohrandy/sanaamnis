"use client";

import React, { useState, useEffect } from "react";
import ProductInteractiveForm from "./ProductInteractiveForm";
import { Star, MessageSquare, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    variants: any[];
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // 1. Load & Update Recently Viewed
  useEffect(() => {
    // Save current product to recently viewed list
    const storedRaw = localStorage.getItem("sana_amnis_recently_viewed");
    let currentList: any[] = [];
    if (storedRaw) {
      try {
        currentList = JSON.parse(storedRaw);
      } catch (e) {
        console.error(e);
      }
    }

    // Filter out current product, prepend it, limit to 4 items
    const filtered = currentList.filter((item) => item.slug !== product.slug);
    const updated = [
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.variants?.[0]?.price || "120000",
        imageUrl: product.variants?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200",
      },
      ...filtered,
    ].slice(0, 4);

    setRecentlyViewed(filtered.slice(0, 4)); // Show other items in UI
    localStorage.setItem("sana_amnis_recently_viewed", JSON.stringify(updated));

    // Seed mock reviews
    setReviews([
      {
        name: "Amina Yusuf",
        rating: 5,
        comment: "Exceptional purity and texture. My hair moisture levels have improved dramatically within a week.",
        date: "June 26, 2026",
      },
      {
        name: "Emeka Okafor",
        rating: 4,
        comment: "Very high quality packaging and prompt delivery in Lekki. Will definitely reorder.",
        date: "June 18, 2026",
      },
    ]);
  }, [product]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: Review = {
        name: reviewerName,
        rating,
        comment,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
      setReviews([newReview, ...reviews]);
      setReviewerName("");
      setComment("");
      setIsSubmitting(false);
    }, 800);
  };

  const primaryImage = product.variants?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";

  return (
    <div className="space-y-20">
      {/* Upper Specs Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery Canvas */}
        <div className="aspect-[4/5] bg-card rounded-2xl overflow-hidden border border-border/40 shadow-[0_10px_40px_rgba(53,94,59,0.02)]">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details info */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {product.title}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-8 border-t border-border/20 mt-8">
            <ProductInteractiveForm
              productId={product.id}
              productTitle={product.title}
              categoryName={product.category}
              variants={product.variants}
            />
          </div>
        </div>
      </div>

      {/* Reviews & Feedback Section */}
      <div className="grid md:grid-cols-12 gap-12 pt-16 border-t border-border/20">
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl font-medium text-foreground">
              Formulation Reviews
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Read critical reports from verified shoppers or submit your authentication review below.
          </p>

          {/* Submission Form */}
          <form onSubmit={handleReviewSubmit} className="bg-card border border-border/40 rounded-2xl p-6 space-y-4 shadow-[0_10px_40px_rgba(53,94,59,0.01)]">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-foreground">
              Add Critique
            </h4>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                Shopper Name
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Amina Yusuf"
                className="w-full p-3 border border-border bg-background text-xs outline-none focus:border-primary rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold block">
                Security Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-3 border border-border bg-background text-xs outline-none focus:border-primary rounded-xl"
              >
                <option value={5}>5 Stars (Excellent)</option>
                <option value={4}>4 Stars (Good)</option>
                <option value={3}>3 Stars (Average)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold block">
                Detailed Feedback
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write formulation feedback here..."
                className="w-full p-3 border border-border bg-background text-xs outline-none focus:border-primary rounded-xl resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-colors rounded-xl disabled:bg-neutral-300"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Post Review"
              )}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-8 space-y-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-card border border-border/40 rounded-2xl p-6 space-y-3 shadow-[0_10px_40px_rgba(53,94,59,0.01)]"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground">{r.name}</span>
                <span className="text-[9px] text-muted-foreground font-bold">{r.date}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-3.5 h-3.5 ${
                      starIndex < r.rating
                        ? "text-accent fill-accent"
                        : "text-muted/20 fill-muted/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-6 pt-16 border-t border-border/20">
          <h3 className="font-serif text-xl font-medium text-foreground">
            Recently Viewed Formulations
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_rgba(53,94,59,0.02)] transition-all duration-300"
              >
                <Link href={`/products/${item.slug}`}>
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    />
                  </div>
                </Link>

                <div className="p-4 space-y-2">
                  <h4 className="font-serif text-sm font-medium text-foreground line-clamp-1">
                    <Link href={`/products/${item.slug}`} className="hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </h4>
                  <span className="text-xs font-semibold text-primary block">
                    ₦{parseFloat(item.price).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
