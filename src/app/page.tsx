import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { db } from "@/db";
import { ChevronRight, Star, CheckCircle2, ShieldCheck, MapPin, Dumbbell, Briefcase, Users, RefreshCw } from "lucide-react";

export const revalidate = 60; // ISR validation time

const FALLBACK_COCONUT_PRODUCTS = [
  {
    id: "1",
    title: "Sana Amnis Coconut Water (500ml)",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: "3,000",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
    description: "100% natural, refreshing coconut water packed with electrolytes, sustainably bottled at the source. Sourced from local Nigerian farms. No added sugar or artificial preservatives.",
  },
  {
    id: "2",
    title: "Sana Amnis Coconut Water (250ml)",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: "1,500",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
    description: "Naturally sweet and refreshing coconut water in a convenient, eco-friendly 250ml pouch format.",
  },
  {
    id: "3",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: "18,000",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
    description: "Ultra-hydrating body moisturizer made with cold-pressed coconut butter and whipped natural oils.",
  },
];

export default async function Home() {
  let products: any[] = FALLBACK_COCONUT_PRODUCTS;

  try {
    const productsInDb = await db.query.products.findMany({
      where: (p, { eq }) => eq(p.isActive, true),
      with: {
        category: true,
        variants: true,
      },
    });

    if (productsInDb && productsInDb.length > 0) {
      products = productsInDb.map((p) => {
        const firstVariantPrice = p.variants?.[0]?.price ? parseFloat(p.variants[0].price).toLocaleString() : "3,000";
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category?.name || "Organic Wellness",
          price: firstVariantPrice,
          imageUrl: p.variants?.[0]?.imageUrl || "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
          description: p.description,
        };
      });
    }
  } catch (err) {
    console.error("DB query failed in homepage, falling back to mock products:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] text-[#1a1c1a]">
      {/* Top Banner Message */}
      <div className="bg-[#1d4626] text-white text-center py-2 text-[11px] uppercase tracking-widest font-semibold font-sans">
        Free Global Delivery on orders over $150
      </div>

      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-20 py-8 space-y-24">
        
        {/* Editorial Hero Layout Block */}
        <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center rounded-3xl overflow-hidden mt-4">
          <img
            alt="Sana Amnis Premium Coconut Wellness"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl brightness-90"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC07WXtYVjd0cZ9GcvZZNyzIPOmSCd0hhyaAN-9MubRN4TsLY7XXhWir0ekH142Oz3vkrBiUu4feTlSttsylndaVvNfTEnSGqMYHrdwgs0ou6YLOYY0yPPoqqixY_--KWZZupzbKmKGXPr29VfWW_MqJ4Sexb666SbUw2B9MrqbAKT9m0zWefDFTSlb0u2raljI1un8yXbmxuB9GWepc21NMP4Uw_EkYElqw1rjiKZACv-ZT3j4ge1Z1ZQ_FrTo6o9dJTRP-JdT4Q0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d4626]/40 to-transparent"></div>
          
          <div className="relative z-10 text-center text-white px-6 max-w-4xl space-y-6 animate-fade-in">
            <h1 className="font-serif text-4xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-lg">
              The Purest Essence<br />of Nigeria
            </h1>
            <p className="font-sans text-sm md:text-lg max-w-xl mx-auto text-neutral-100 opacity-95 leading-relaxed font-light drop-shadow-sm">
              Sustainably sourced, traditionally crafted coconut water and wellness formulas for a balanced, vibrant life.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#1d4626] hover:bg-[#355e3b] text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-full shadow-lg hover:scale-105"
              >
                Explore Collections <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Floating Organic Stats Panel */}
        <section className="-mt-12 relative z-20">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-wrap justify-around items-center shadow-[0_10px_40px_rgba(53,94,59,0.05)] border border-white">
            <div className="flex items-center gap-3 py-2">
              <CheckCircle2 className="w-6 h-6 text-[#1d4626]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#424941]">Free Delivery</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-neutral-200" />
            <div className="flex items-center gap-3 py-2">
              <ShieldCheck className="w-6 h-6 text-[#1d4626]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#424941]">100% Organic</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-neutral-200" />
            <div className="flex items-center gap-3 py-2">
              <MapPin className="w-6 h-6 text-[#1d4626]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#424941]">Made in Nigeria</span>
            </div>
          </div>
        </section>

        {/* Special Delivery Offer Banner */}
        <section className="bg-[#F3EFE8] rounded-3xl p-8 md:p-12 border border-[#E5E7EB] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">Limited Promotion</span>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#1d4626]">Special Delivery Offer</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">
              Buy 10+ 500ml bottles (or 20+ 250ml pouches) and get <strong>FREE DELIVERY</strong> anywhere in Nigeria! 
              Save on delivery fees and enjoy our premium electrolyte-rich coconut water delivered straight to your doorstep.
            </p>
          </div>
          <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-neutral-200 shadow-sm min-w-[280px] space-y-4 text-center">
            <div className="text-[#355E3B] font-serif font-bold text-2xl">₦30,000</div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-sans">10 Bottles (500ml) Pack</div>
            <div className="bg-emerald-100 text-[#1d4626] py-2 rounded-full text-xs font-bold uppercase tracking-wide">
              + Free Shipping
            </div>
            <Link
              href="/shop"
              className="block w-full bg-[#1d4626] hover:bg-[#355e3b] text-white py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Order Offer
            </Link>
          </div>
        </section>

        {/* Occasions Sections */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">Ritual & Wellness</span>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#1d4626]">Perfect Occasions for Sana Amnis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-neutral-100 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto text-[#1d4626]">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1d4626]">Fitness & Workouts</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Replenish active minerals and trace elements naturally after intense workout and weight sessions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-neutral-100 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto text-[#1d4626]">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1d4626]">Office Hydration</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Stay refreshed, productive, and focused throughout long administrative days without bloating or sugar crashes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-neutral-100 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto text-[#1d4626]">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1d4626]">Family Events</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Serve a delicious, healthy beverage option for kids and gatherings. A natural replacement for sweet soda sodas.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Products Grid Section */}
        <section className="space-y-12">
          <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">Our Formulation</span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#1d4626] mt-1">Featured Essentials</h3>
            </div>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#1d4626] hover:text-[#355e3b] flex items-center gap-1 transition-colors">
              Browse Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#f4f3f1] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_50px_rgba(53,94,59,0.1)] flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200 relative">
                  <img
                    alt={item.title}
                    src={item.imageUrl}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-[#755b00]">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">{item.category}</span>
                      <span className="text-xs font-bold text-[#cea62c]">₦{item.price}</span>
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-[#1d4626] group-hover:text-[#3b6845] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-200/50 flex gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex-1 text-center bg-[#1d4626] hover:bg-[#355e3b] text-white py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Satisfaction Guarantee Section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 text-center border border-neutral-100 max-w-4xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#C9A227]">
            <RefreshCw className="w-8 h-8 animate-spin-slow" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-[#1d4626]">100% Satisfaction Guarantee</h3>
          <p className="text-sm text-neutral-600 leading-relaxed font-sans max-w-2xl mx-auto">
            Not completely satisfied with your Sana Amnis coconut water? We offer a 100% money-back guarantee on all orders. 
            Your health, wellness, and complete satisfaction remain our ultimate priorities.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
