import React, { useState, useEffect } from "react";
import {
  Star,
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Bookmark,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  getWishlist,
  removeFromWishlist,
} from "../api/api";

const WishlistPage = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});

  // Product ID helper
  const getProductId = (product) =>
    String(product?._id || product?.id || product?.sku || "");

  // Product image helper
  const getProductImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === "string"
        ? firstImage
        : firstImage?.url || "";
    }

    if (typeof product?.image === "string") {
      return product.image;
    }

    return product?.image?.url || "";
  };

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setWishlist([]);
        return;
      }

      const response = await getWishlist();

      setWishlist(
        Array.isArray(response?.products)
          ? response.products
          : []
      );
    } catch (error) {
      console.error("Wishlist retrieval failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove product from wishlist
  const handleRemoveFromWishlist = async (product) => {
    const productId = getProductId(product);

    if (!productId || removing[productId]) return;

    setRemoving((previous) => ({
      ...previous,
      [productId]: true,
    }));

    try {
      const response = await removeFromWishlist(productId);

      if (Array.isArray(response?.products)) {
        setWishlist(response.products);
      } else {
        setWishlist((previous) =>
          previous.filter(
            (item) => getProductId(item) !== productId
          )
        );
      }
    } catch (error) {
      console.error("Wishlist removal failed:", error.message);
      alert(error.message || "Unable to remove product at this time.");
    } finally {
      setRemoving((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
  };

  // Open product details
  const handleProductClick = (product) => {
    const productId = getProductId(product);

    navigate("/product", {
      state: {
        productId,
        categoryName:
          typeof product.category === "object"
            ? product.category?.name || "Men"
            : "Men",
        categoryId:
          typeof product.category === "object"
            ? product.category?._id || ""
            : "",
      },
    });
  };

  // Add to cart handler
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    const productId = String(product?._id || product?.id || "");

    if (!token) {
      alert("Please sign in to add items to your personal shopping bag.");
      navigate("/auth");
      return;
    }

    if (!productId) {
      alert("Product reference unavailable.");
      return;
    }

    try {
      await addToCart({
        productId,
        quantity: 1,
      });

      navigate("/cart");
    } catch (error) {
      console.error("Cart addition failed:", error);
      alert(error.message || "Unable to add product to your bag.");
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 min-h-screen py-10 px-4 sm:px-8 lg:px-12 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
              <Bookmark size={14} /> Private Curation
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your Saved Vault
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Handpicked luxury selections reserved for your future wardrobe.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-sm self-start sm:self-auto">
            <Sparkles size={14} className="text-amber-600" />
            <span>{wishlist.length} Reserved Pieces</span>
          </div>
        </div>

        {/* Loading View */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-80 rounded-3xl bg-stone-100 animate-pulse border border-stone-200/60"
              />
            ))}
          </div>
        ) : wishlist.length > 0 ? (

          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const productId = getProductId(product);
              const image = getProductImage(product);
              const price = Number(product.price || 0);
              const rating = Number(product.rating || 4.8);

              return (
                <div
                  key={productId}
                  className="group bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between relative"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => handleProductClick(product)}
                    className="relative w-full h-60 bg-stone-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-stone-100 cursor-pointer"
                  >
                    <img
                      src={
                        image ||
                        "https://placehold.co/600x600/png?text=Product"
                      }
                      alt={product.name || "Product"}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Quick Remove Button */}
                    <button
                      type="button"
                      disabled={Boolean(removing[productId])}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveFromWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-stone-200/80 flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all disabled:opacity-50 z-10"
                      title="Remove from saved vault"
                      aria-label="Remove from saved vault"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Product Metadata */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        onClick={() => handleProductClick(product)}
                        className="text-sm font-extrabold text-stone-900 group-hover:text-amber-700 transition-colors truncate cursor-pointer flex-1"
                      >
                        {product.name || "Exclusive Merchandise"}
                      </h3>

                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg shrink-0">
                        <Star
                          size={12}
                          className="text-amber-500 fill-amber-500"
                        />
                        <span className="text-[11px] font-extrabold text-amber-900">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-stone-100 pt-2">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Price
                      </span>
                      <p className="text-base font-black text-stone-900">
                        ₹{price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          /* Empty Vault View */
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80 shadow-sm space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
              <Bookmark size={28} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-stone-900">
                Your Saved Vault Is Empty
              </h3>
              <p className="text-xs text-stone-500 font-medium leading-relaxed">
                You haven't reserved any luxury items yet. Explore our latest arrivals and tap the heart icon to save your favorite designs.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate("/product")}
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-amber-200 font-extrabold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <span>Discover Catalog</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;