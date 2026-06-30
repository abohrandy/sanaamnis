import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { db } from "@/db";
import { ShoppingBag, ChevronRight, Star, Heart, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

export const revalidate = 60; // ISR validation time

const FALLBACK_COCONUT_PRODUCTS = [
  {
    id: "1",
    title: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    category: "Organic Wellness",
    price: "15,000",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLtEqIT_GCpHNQ86QNj1d3bPOlvb9nkQc6svZvyYlyg1Hk3RZHwiIAPv9YCbyw1u0Rj0p73zt-Argu2A7GH5nvmHI045TzwWA2e9fL9omZXhv5idqLb76Wg3h89GyuMytVRKzJIsliofcN_BAcgsvJVHo8b5f8Q8aqeRAb1U7k9geoURsq168OaQUixCGl-WU2SRNk4SwilDr4UJkc83bAJamhtHfvfo0sh9qggUZS3nksvuQahllqEWWw",
    description: "Cold-pressed from fresh organic coconuts in Nigeria, retaining all nutritional benefits and a delicate aroma.",
  },
  {
    id: "2",
    title: "Organic Coconut Water",
    slug: "organic-coconut-water",
    category: "Organic Wellness",
    price: "4,500",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
    description: "100% natural, refreshing coconut water packed with electrolytes, sustainably bottled at the source.",
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
      products = productsInDb.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category?.name || "Organic Wellness",
        price: p.variants?.[0]?.price ? parseFloat(p.variants[0].price).toLocaleString() : "15,000",
        imageUrl: p.variants?.[0]?.imageUrl || "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
        description: p.description,
      }));
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
            <h1 className="font-serif text-4xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-md">
              The Purest Essence<br />of Nigeria
            </h1>
            <p className="font-sans text-sm md:text-lg max-w-xl mx-auto text-neutral-100 opacity-95 leading-relaxed font-light drop-shadow-sm">
              Sustainably sourced, traditionally crafted coconut products for a balanced, vibrant life.
            </p>
            <div className="pt-4">
              <Link
                href="/catalog"
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

        {/* Rich Brand Intro Block */}
        <section className="text-center max-w-3xl mx-auto space-y-6 py-4">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1d4626]">
            Organic Precision & Botanical Purity
          </h2>
          <p className="font-sans text-neutral-600 leading-relaxed text-sm md:text-base">
            We believe in elevating daily self-care rituals with high-end, cold-pressed coconut formulas. 
            Sustainably harvested from local palms, our coconut water, butter, and oils are audited to guarantee 
            uncompromised quality, zero additives, and direct empowerment of Nigerian farming families.
          </p>
        </section>

        {/* Dynamic Products Grid Section */}
        <section className="space-y-12">
          <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#cea62c]">Our Formulation</span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#1d4626] mt-1">Featured Essentials</h3>
            </div>
            <Link href="/catalog" className="text-xs font-bold uppercase tracking-widest text-[#1d4626] hover:text-[#355e3b] flex items-center gap-1 transition-colors">
              Browse Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#f4f3f1] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_50px_rgba(53,94,59,0.1)] flex flex-col justify-between"
              >
                {/* Image Wrap */}
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

                {/* Details Content */}
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

      </main>

      <Footer />
    </div>
  );
}
