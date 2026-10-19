import React, { useState } from 'react';
import { Star, Sparkles, ShoppingBag, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// 4 Handpicked Featured Bestsellers
const featuredProducts = [
  {
    id: 1,
    name: 'Nike Air Force 1 "Special Edition"',
    category: 'Footwear',
    price: '₹ 6,099',
    originalPrice: '₹ 7,999',
    discount: '23% OFF',
    rating: 4.8,
    reviews: '120',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Casio Edifice Vintage Chronograph',
    category: 'Watches',
    price: '₹ 4,999',
    originalPrice: '₹ 6,499',
    discount: '23% OFF',
    rating: 4.6,
    reviews: '85',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Minimalist Urban Travel Backpack',
    category: 'Accessories',
    price: '₹ 2,499',
    originalPrice: '₹ 3,299',
    discount: '24% OFF',
    rating: 4.7,
    reviews: '98',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Sony Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    price: '₹ 3,999',
    originalPrice: '₹ 5,499',
    discount: '27% OFF',
    rating: 4.9,
    reviews: '210',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  },
];

const FeaturedProducts = () => {
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full bg-gradient-to-b from-stone-50 via-white to-amber-50/20 py-16 px-4 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200/80 pb-6 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-bold tracking-wide uppercase">
              <Sparkles size={13} className="text-amber-600" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-stone-500 font-medium max-w-lg">
              Handpicked bestsellers chosen for their unmatched quality and timeless design
            </p>
          </div>

          {/* View All Store Link */}
          <Link
            to="/product"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-stone-900 transition-colors group self-start sm:self-auto"
          >
            <span>Explore Store</span>
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 4 Product Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const isLiked = wishlist[product.id];

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl p-4 border border-stone-200/70 shadow-sm hover:shadow-xl hover:shadow-amber-900/5 hover:border-amber-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative w-full h-64 bg-stone-100/70 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                  
                  {/* Discount Badge */}
                  <span className="absolute top-3 left-3 bg-stone-900 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm z-10">
                    {product.discount}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(product.id, e)}
                    aria-label="Wishlist"
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 flex items-center justify-center transition-all shadow-sm z-10 hover:scale-110 active:scale-95"
                  >
                    <Heart
                      size={16}
                      className={isLiked ? "text-rose-500 fill-rose-500" : "text-stone-400 hover:text-rose-500"}
                    />
                  </button>

                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Details Section */}
                <div className="pt-4 px-1 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs text-stone-400 font-medium mb-1">
                      <span>{product.category}</span>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-bold text-amber-900">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="space-y-3 pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-stone-900">
                        {product.price}
                      </span>
                      <span className="text-xs text-stone-400 line-through font-medium">
                        {product.originalPrice}
                      </span>
                    </div>

                    <Link to="/product" className="block w-full">
                      <button
                        type="button"
                        className="w-full bg-stone-900 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                      >
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </button>
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;