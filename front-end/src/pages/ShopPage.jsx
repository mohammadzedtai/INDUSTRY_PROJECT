import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  ChevronDown,
  Filter,
  Layers,
  Heart,
  SlidersHorizontal,
  X,
  Sparkles,
  Check
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductDetailPage from "./ProductDetailPage";
import {
  getCategorydata,
  getProductdata,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/api";

const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-1000", label: "Under ₹1,000", min: 0, max: 1000 },
  { id: "1000-2000", label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { id: "2000-5000", label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5000, max: Infinity },
];

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handledProductId = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.categoryName || "Men"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    location.state?.categoryId || ""
  );
  const [product, setProduct] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Database wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistUpdating, setWishlistUpdating] = useState({});

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.key]);

  const getCategoryName = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      return value.name || value.title || "";
    }
    return String(value);
  };

  const getCategoryId = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      return String(value._id || value.id || "");
    }
    return String(value);
  };

  const getProductId = (item) =>
    String(item?._id || item?.id || item?.sku || "");

  // Load wishlist from database
  useEffect(() => {
    let active = true;

    const loadWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (active) setWishlist([]);
          return;
        }
        const response = await getWishlist();
        if (active) {
          setWishlist(
            Array.isArray(response?.products) ? response.products : []
          );
        }
      } catch (error) {
        console.error("Wishlist load failed:", error.message);
      } finally {
        if (active) setWishlistLoading(false);
      }
    };

    loadWishlist();
    return () => {
      active = false;
    };
  }, []);

  const toggleWishlist = async (item) => {
    const productId = getProductId(item);
    if (!productId) {
      alert("Product ID nahi mili.");
      return;
    }

    if (!localStorage.getItem("token")) {
      alert("Wishlist use karne ke liye pehle login karo.");
      navigate("/auth");
      return;
    }

    if (wishlistUpdating[productId]) return;

    const alreadyExists = wishlist.some(
      (wishlistItem) => getProductId(wishlistItem) === productId
    );

    setWishlistUpdating((previous) => ({
      ...previous,
      [productId]: true,
    }));

    try {
      const response = alreadyExists
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId);

      if (Array.isArray(response?.products)) {
        setWishlist(response.products);
      } else {
        setWishlist((previous) =>
          alreadyExists
            ? previous.filter(
                (wishlistItem) => getProductId(wishlistItem) !== productId
              )
            : [...previous, item]
        );
      }

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist update failed:", error.message);
      alert(error.message || "Wishlist update nahi hui.");
    } finally {
      setWishlistUpdating((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
  };

  const currentCategoryObj = categoriesData.find(
    (category) => category.name === selectedCategory
  );

  const handleCategoryChange = (categoryName) => {
    const category = categoriesData.find(
      (item) => item.name === categoryName
    );

    setSelectedCategory(categoryName);
    setSelectedCategoryId(String(category?._id || ""));
    setSelectedSubCategory("All");
  };

  useEffect(() => {
    let active = true;

    const getData = async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes] = await Promise.all([
          getProductdata(),
          getCategorydata(),
        ]);

        const products =
          productRes?.data?.data || productRes?.data || [];
        const categories =
          categoryRes?.data?.data || categoryRes?.data || [];

        const safeProducts = Array.isArray(products) ? products : [];
        const safeCategories = Array.isArray(categories) ? categories : [];

        if (!active) return;

        setProduct(safeProducts);
        setAllCategories(safeCategories);

        const parentCategories = safeCategories
          .filter((category) => {
            const parentId = getCategoryId(category.parentCategory);
            return (
              !parentId ||
              parentId === "null" ||
              parentId === "undefined"
            );
          })
          .map((category) => ({
            ...category,
            subCategories: [
              "All",
              ...safeCategories
                .filter(
                  (subCategory) =>
                    getCategoryId(subCategory.parentCategory) ===
                    String(category._id)
                )
                .map((subCategory) => subCategory.name),
            ],
          }));

        setCategoriesData(parentCategories);

        const passedCategoryId = location.state?.categoryId;
        const passedCategoryName = location.state?.categoryName;

        const matchedCategory = parentCategories.find((category) => {
          const idMatches =
            passedCategoryId &&
            String(category._id) === String(passedCategoryId);

          const nameMatches =
            passedCategoryName &&
            category.name?.toLowerCase() ===
            passedCategoryName.toLowerCase();

          return idMatches || nameMatches;
        });

        const defaultCategory =
          matchedCategory ||
          parentCategories.find((category) => category.name === "Men") ||
          parentCategories[0];

        if (defaultCategory) {
          setSelectedCategory(defaultCategory.name);
          setSelectedCategoryId(String(defaultCategory._id));
          setSelectedSubCategory("All");
        }
      } catch (error) {
        console.error(
          "Shop data fetch failed:",
          error.response?.data || error.message
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    getData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const requestedProductId = location.state?.productId;

    if (!requestedProductId || product.length === 0) return;
    if (handledProductId.current === String(requestedProductId)) return;

    const matchedProduct = product.find(
      (item) =>
        String(item._id || item.id) === String(requestedProductId)
    );

    if (!matchedProduct) return;

    handledProductId.current = String(requestedProductId);
    setSelectedProduct(matchedProduct);

    navigate(location.pathname, {
      replace: true,
      state: {
        categoryName: location.state?.categoryName || "Men",
        categoryId: location.state?.categoryId || "",
      },
    });
  }, [product, location.state?.productId, location.pathname, navigate]);

  const belongsToParentCategory = (category, parentId) => {
    let currentCategory = category;
    const visited = new Set();

    while (currentCategory) {
      const currentId = getCategoryId(currentCategory);
      if (!currentId || visited.has(currentId)) break;
      visited.add(currentId);

      const foundCategory = allCategories.find(
        (item) => String(item._id) === currentId
      );

      if (!foundCategory) return false;

      const foundParentId = getCategoryId(foundCategory.parentCategory);
      if (foundParentId === String(parentId)) return true;
      if (!foundParentId) return false;

      currentCategory = foundParentId;
    }

    return false;
  };

  const filteredProducts = product.filter((item) => {
    const categoryValue = item.category || item.categoryId;
    const categoryId = getCategoryId(categoryValue);

    const productCategory = allCategories.find(
      (category) => String(category._id) === categoryId
    );

    const productCategoryName =
      productCategory?.name || getCategoryName(categoryValue);

    const activeCategoryId = String(
      selectedCategoryId || currentCategoryObj?._id || ""
    );

    const isMainCategoryMatch =
      productCategoryName.toLowerCase() === selectedCategory.toLowerCase() ||
      (activeCategoryId !== "" &&
        belongsToParentCategory(categoryId, activeCategoryId));

    const isSubCategoryMatch =
      selectedSubCategory === "All" ||
      productCategoryName.toLowerCase() ===
      selectedSubCategory.toLowerCase();

    const activePriceRange = priceRanges.find(
      (range) => range.id === selectedPriceRange
    );

    const price = Number(item.price || 0);

    const isPriceMatch =
      activePriceRange &&
      price >= activePriceRange.min &&
      price <= activePriceRange.max;

    return isMainCategoryMatch && isSubCategoryMatch && isPriceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-high") {
      return Number(a.price || 0) - Number(b.price || 0);
    }
    if (sortBy === "high-low") {
      return Number(b.price || 0) - Number(a.price || 0);
    }
    return Number(b.reviews || 0) - Number(a.reviews || 0);
  });

  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen pb-24 font-sans">
      
      {/* Clean Modern Header Section */}
      <div className="bg-white border-b border-stone-200/80 pt-10 pb-8 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
                <Sparkles size={13} /> Discover Catalog
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Explore Shop
              </h1>
            </div>

            {/* Quick Action Bar (Filter Drawer Toggle & Sort) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-sm hover:bg-black transition-all"
              >
                <SlidersHorizontal size={15} />
                <span>Filters & Price</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-stone-100 border border-stone-200 rounded-2xl px-4 py-3 pr-9 text-xs font-bold text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-sm"
                >
                  <option value="popular">Sort: Popularity</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Horizontal Main Categories Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesData.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat._id || cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "bg-stone-900 text-amber-200 shadow-md scale-105"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Subcategories Horizontal Chips */}
          {currentCategoryObj && currentCategoryObj.subCategories?.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-stone-100 scrollbar-none">
              <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mr-2">
                Sub-Type:
              </span>
              {currentCategoryObj.subCategories.map((subCat) => (
                <button
                  key={subCat}
                  onClick={() => setSelectedSubCategory(subCat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubCategory === subCat
                      ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-sm"
                      : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {subCat}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Main Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-10">
        
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Showing <span className="text-stone-900">{sortedProducts.length}</span> items in {selectedCategory}
            {selectedSubCategory !== "All" && ` / ${selectedSubCategory}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-stone-200/60 animate-pulse"></div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((item) => {
              const productCategoryId = getCategoryId(
                item.category || item.categoryId
              );

              const categoryName =
                allCategories.find(
                  (category) =>
                    String(category._id) === productCategoryId
                )?.name ||
                getCategoryName(item.category || item.categoryId);

              const productImage = Array.isArray(item.images)
                ? item.images[0]
                : item.image;

              const price = Number(item.price || 0);
              const originalPrice = Number(item.originalPrice || 0);

              const discount =
                originalPrice > price && originalPrice > 0
                  ? Math.round(
                      ((originalPrice - price) / originalPrice) * 100
                    )
                  : 0;

              const productId = getProductId(item);

              const isWishlisted = wishlist.some(
                (wishlistItem) =>
                  getProductId(wishlistItem) === productId
              );

              const isUpdating = Boolean(wishlistUpdating[productId]);

              return (
                <div
                  key={productId || item.name}
                  onClick={() => setSelectedProduct(item)}
                  className="group bg-white rounded-3xl p-4 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-60 bg-[#FAF9F6] rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-stone-100">
                    <img
                      src={
                        productImage ||
                        "https://placehold.co/600x600/png?text=Product"
                      }
                      alt={item.name || "Product"}
                      loading="lazy"
                      className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-stone-900 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm z-10">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="pt-4 px-1 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                        {categoryName}
                      </span>

                      <div className="flex items-center gap-1 bg-[#FAF3EA] px-2 py-0.5 rounded-md border border-[#EEDFCD]">
                        <Star size={11} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-amber-900">
                          {Number(item.rating || 4.5)} ({Number(item.reviews || 12)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors truncate flex-1">
                        {item.name}
                      </h3>

                      <button
                        type="button"
                        disabled={isUpdating || wishlistLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        aria-label="Wishlist"
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                          isWishlisted
                            ? "bg-rose-50 border-rose-200 text-rose-500 shadow-sm"
                            : "bg-white border-stone-200 text-stone-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                        } ${
                          isUpdating || wishlistLoading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Heart
                          size={16}
                          fill={isWishlisted ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1 border-t border-stone-100">
                      <p className="text-base font-black text-stone-900">
                        ₹{price.toLocaleString("en-IN")}
                      </p>
                      {discount > 0 && (
                        <p className="text-xs text-stone-400 line-through font-medium">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
              <Filter size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">No products found</h3>
              <p className="text-xs text-stone-400 font-medium">
                Try changing your filters or price range.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedSubCategory("All");
                setSelectedPriceRange("all");
              }}
              className="bg-stone-900 text-amber-200 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-stone-800 transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Filter & Price Drawer Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between">
              
              {/* Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-amber-700" />
                    <h2 className="text-lg font-black text-stone-900">Filter Products</h2>
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Price Range Options */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                    Select Price Range
                  </h3>

                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedPriceRange === range.id
                            ? "bg-amber-50/80 border-amber-400 text-amber-900 font-bold shadow-sm"
                            : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="priceRangeDrawer"
                            checked={selectedPriceRange === range.id}
                            onChange={() => setSelectedPriceRange(range.id)}
                            className="w-4 h-4 text-amber-600 accent-amber-600"
                          />
                          <span className="text-xs sm:text-sm">{range.label}</span>
                        </div>
                        {selectedPriceRange === range.id && (
                          <Check size={16} className="text-amber-700" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-stone-200 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedPriceRange("all");
                    setSelectedSubCategory("All");
                  }}
                  className="w-1/2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-1/2 bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopPage;