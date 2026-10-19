import React, { useState, useEffect } from "react";
import { ArrowUpRight, Sparkles, ShoppingBag } from "lucide-react";
import { getCategorydata } from "../api/api";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch parent categories
  const getdata = async () => {
    try {
      setLoading(true);
      const res = await getCategorydata();

      const categories = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];

      // Parent categories filter
      const parentCategories = categories.filter((cat) => !cat.parentCategory);
      setData(parentCategories);
    } catch (error) {
      console.error("Categories fetch failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50/50 py-16 px-4 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200/80 pb-6 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-xs font-bold tracking-wide uppercase">
              <Sparkles size={13} className="text-amber-600" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-stone-500 font-medium max-w-lg">
              Explore our wide range of handpicked categories designed for modern living
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-900 text-amber-300 text-xs font-bold px-4 py-2 rounded-full shadow-sm self-start sm:self-auto">
            <ShoppingBag size={14} />
            <span>{data.length} Categories Available</span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-stone-200/60 animate-pulse"></div>
            ))}
          </div>
        ) : (
          /* Categories Grid - Showing ALL Categories */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {data.map((cat) => (
              <div
                key={cat._id}
                onClick={() =>
                  navigate("/product", {
                    state: {
                      categoryId: cat._id,
                      categoryName: cat.name,
                    },
                  })
                }
                className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-500 transform hover:-translate-y-1.5"
              >
                {/* Category Image */}
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlays for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent transition-opacity duration-300 group-hover:from-stone-950/95" />

                {/* Card Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                  
                  {/* Top Corner Action Arrow */}
                  <div className="self-end">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-amber-500 group-hover:text-stone-950 group-hover:border-amber-500 transition-all duration-300 shadow-md">
                      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-300 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                      Explore Collection
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Categories;