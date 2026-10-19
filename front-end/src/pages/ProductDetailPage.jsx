
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  RefreshCw,
  Truck,
  ArrowLeft,
  ShoppingBag,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  addProductReview,
  addToCart,
  getProductReviews,
} from "../api/api";

const ProductDetailPage = ({ product, onBack }) => {
  const navigate = useNavigate();

  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  const handleAuthRedirect = () => {
    if (!isLoggedIn()) {
      alert("Please login first to continue.");
      navigate("/login");
      return false;
    }

    return true;
  };

  // Product images
  const galleryImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : ["https://placehold.co/800x1000/f1ede5/333333?text=Product"];

  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  // Colour helpers
  const getColourName = (colour) => {
    if (typeof colour === "string") return colour;

    return (
      colour?.name ||
      colour?.colour ||
      colour?.color ||
      colour?.value ||
      ""
    );
  };

  const getColourCode = (colour) => {
    if (typeof colour === "object" && colour !== null) {
      return (
        colour.code ||
        colour.hex ||
        colour.value ||
        colour.name ||
        "#e5e7eb"
      );
    }

    const colourCodes = {
      black: "#171717",
      white: "#ffffff",
      red: "#dc2626",
      blue: "#3b82f6",
      green: "#16a34a",
      yellow: "#eab308",
      pink: "#ec4899",
      purple: "#9333ea",
      grey: "#9ca3af",
      gray: "#9ca3af",
      brown: "#92400e",
      orange: "#f97316",
      beige: "#d6c3a3",
      navy: "#1e3a8a",
      cream: "#f5f0e6",
    };

    return colourCodes[String(colour || "").toLowerCase()] || "#e5e7eb";
  };

  // Sizes from database
  const sizes = (() => {
    if (Array.isArray(product?.sizeStock) && product.sizeStock.length > 0) {
      return [
        ...new Set(
          product.sizeStock
            .map((entry) => String(entry?.size || "").trim())
            .filter(Boolean)
        ),
      ];
    }

    return Array.isArray(product?.sizes)
      ? [
          ...new Set(
            product.sizes
              .map((size) => String(size).trim())
              .filter(Boolean)
          ),
        ]
      : [];
  })();

  // Colours from database
  const colors = (() => {
    if (Array.isArray(product?.sizeStock) && product.sizeStock.length > 0) {
      return [
        ...new Set(
          product.sizeStock.flatMap((sizeEntry) =>
            (Array.isArray(sizeEntry?.colourStock)
              ? sizeEntry.colourStock
              : []
            )
              .map((entry) => getColourName(entry?.colour))
              .filter(Boolean)
          )
        ),
      ];
    }

    if (Array.isArray(product?.colors)) {
      return [
        ...new Set(product.colors.map(getColourName).filter(Boolean)),
      ];
    }

    return [];
  })();

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState("");

  // Reset selection when product changes
  useEffect(() => {
    setSelectedImage(galleryImages[0]);
    setSelectedSize(sizes[0] || "");
    setSelectedColor("");
    setQuantity(1);
    setActiveTab("description");
    setReviews([]);
    setAverageRating(0);
    setTotalReviews(0);
  }, [product?._id]);

  // Colours available for selected size
  const getColoursForSize = (size) => {
    const sizeEntry = product?.sizeStock?.find(
      (entry) => String(entry.size) === String(size)
    );

    if (sizeEntry && Array.isArray(sizeEntry.colourStock)) {
      return sizeEntry.colourStock
        .filter((entry) => getColourName(entry.colour))
        .map((entry) => ({
          name: getColourName(entry.colour),
          quantity: Math.max(0, Number(entry.quantity) || 0),
          code: getColourCode(entry.colour),
        }));
    }

    return colors.map((colour) => ({
      name: colour,
      quantity: Math.max(0, Number(product?.stock) || 0),
      code: getColourCode(colour),
    }));
  };

  const availableColors = getColoursForSize(selectedSize);
  const hasSizeStock =
    Array.isArray(product?.sizeStock) && product.sizeStock.length > 0;

  // Automatically choose an available colour
  useEffect(() => {
    if (!availableColors.length) {
      setSelectedColor("");
      return;
    }

    const selectedStillExists = availableColors.some(
      (colour) => colour.name === selectedColor
    );

    if (!selectedStillExists) {
      const inStockColour = availableColors.find(
        (colour) => colour.quantity > 0
      );

      setSelectedColor((inStockColour || availableColors[0]).name);
    }
  }, [selectedSize, product?._id]);

  const selectedColourStock = availableColors.find(
    (colour) => colour.name === selectedColor
  );

  const availableStock = hasSizeStock
    ? Math.max(0, Number(selectedColourStock?.quantity) || 0)
    : Math.max(0, Number(product?.stock) || 0);

  const stockToDisplay =
    sizes.length > 0 && colors.length > 0
      ? availableStock
      : Math.max(0, Number(product?.stock) || 0);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    if (!product?._id) return;

    try {
      setReviewsLoading(true);
      setReviewError("");

      const response = await getProductReviews(product._id);
      const data = response?.data ?? response;

      setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      setAverageRating(Number(data?.averageRating) || 0);
      setTotalReviews(Number(data?.totalReviews) || 0);
    } catch (error) {
      console.error("Fetch reviews error:", error);

      setReviewError(
        error.response?.data?.message || "Unable to load reviews."
      );
    } finally {
      setReviewsLoading(false);
    }
  }, [product?._id]);

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab, fetchReviews]);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!handleAuthRedirect()) return;

    if (!product?._id) {
      setReviewError("Product not found.");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Please select a star rating.");
      return;
    }

    if (!reviewDescription.trim()) {
      setReviewError("Please write your review.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");

      await addProductReview(product._id, {
        rating: reviewRating,
        description: reviewDescription.trim(),
      });

      setReviewRating(0);
      setReviewDescription("");

      await fetchReviews();

      alert("Your review has been submitted successfully!");
    } catch (error) {
      console.error("Submit review error:", error);

      setReviewError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Unable to submit your review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Validate product selection
  const validateSelection = () => {
    if (!localStorage.getItem("token")) {
      alert("Please login first to continue.");
      navigate("/login");
      return false;
    }

    if (!product?._id) {
      alert("Product ID missing. Please check your product data.");
      return false;
    }

    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return false;
    }

    if (colors.length > 0 && !selectedColor) {
      alert("Please select a colour.");
      return false;
    }

    if (stockToDisplay <= 0) {
      alert("Selected size and colour are out of stock.");
      return false;
    }

    if (quantity > stockToDisplay) {
      alert(`Only ${stockToDisplay} items are available.`);
      return false;
    }

    return true;
  };

  // Add to cart
  const handleCartAction = async () => {
    if (!validateSelection()) return;

    try {
      setCartLoading(true);

      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to add product to cart."
      );
    } finally {
      setCartLoading(false);
    }
  };

  // Buy Now: add to cart, then navigate to cart.
  // Change the destination to your checkout route if required.
  const handleBuyNow = async () => {
    if (!validateSelection()) return;

    try {
      setBuyNowLoading(true);

      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      navigate("/cart");
    } catch (error) {
      console.error("Buy now error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to proceed. Please try again."
      );
    } finally {
      setBuyNowLoading(false);
    }
  };

  const price = Number(product?.price || 0);
  const originalPrice = Number(product?.originalPrice || 0);

  const discount =
    originalPrice > price && originalPrice > 0
      ? product?.discount != null
        ? Number(product.discount)
        : Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const specifications = (() => {
    const specs = product?.specifications;

    const entries =
      specs instanceof Map
        ? Array.from(specs.entries())
        : Array.isArray(specs)
          ? specs.map((item, index) => [
              item.key || item.name || `Specification ${index + 1}`,
              item.value ?? "",
            ])
          : specs && typeof specs === "object"
            ? Object.entries(specs)
            : [];

    return entries.filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );
  })();

  const canPurchase =
    !cartLoading &&
    !buyNowLoading &&
    stockToDisplay > 0 &&
    !(sizes.length > 0 && !selectedSize) &&
    !(colors.length > 0 && !selectedColor);

  return (
    <div className="min-h-screen bg-[#f8f6f1] font-sans text-[#171717]">

      <main className="mx-auto max-w-[1500px] px-4 pb-16 pt-6 sm:px-8 lg:px-12 lg:pt-10">
        {/* Breadcrumb */}
        <div className="mb-7 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <button onClick={() => navigate("/")}>Home</button>
          <ChevronRight size={13} />
          <button onClick={onBack}>Shop</button>
          <ChevronRight size={13} />
          <span className="max-w-[220px] truncate text-gray-900">
            {product?.name || "Product"}
          </span>
        </div>

        {/* Product Gallery + Details */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery */}
          <section className="lg:sticky lg:top-28 lg:col-span-7">
            <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-3 sm:grid-cols-[82px_minmax(0,1fr)] sm:gap-4">
              <div className="flex flex-col gap-3">
                {galleryImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View product image ${index + 1}`}
                    className={`aspect-[4/5] overflow-hidden rounded-xl border bg-[#eee9e0] transition ${
                      selectedImage === img
                        ? "border-black ring-1 ring-black"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product?.name || "Product"} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eee9e0] sm:rounded-3xl">
                <img
                  src={selectedImage || galleryImages[0]}
                  alt={product?.name || "Product"}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                />

                <span className="absolute left-4 top-4 rounded-full bg-[#faf8f3]/95 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] sm:left-6 sm:top-6">
                  Premium Collection
                </span>

                {discount > 0 && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-black px-4 py-2 text-[10px] font-bold tracking-wider text-white sm:bottom-6 sm:left-6">
                    SAVE {discount}%
                  </span>
                )}
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-gray-400">
              Designed for everyday elegance
            </p>
          </section>

          {/* Product Details */}
          <section className="lg:col-span-5 lg:pt-2">
            <div className="border-b border-[#e5dfd5] pb-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a7950]">
                  {product?.brand || "Premium Selection"}
                </span>

                <span className="rounded-full border border-[#e1d5c3] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#866744]">
                  Exclusive Edit
                </span>
              </div>

              <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {product?.name || "Product Name"}
              </h1>

              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="mt-4 flex flex-wrap items-center gap-3 text-sm"
              >
                <span className="flex gap-0.5 text-[#c08b37]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
                      fill={
                        star <= Math.round(averageRating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </span>
                <span className="font-semibold">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500 underline underline-offset-4">
                  {totalReviews} customer reviews
                </span>
              </button>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-semibold tracking-tight">
                  ₹{formatPrice(price)}
                </span>

                {originalPrice > price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{formatPrice(originalPrice)}
                    </span>
                    <span className="bg-[#e9dfce] px-2.5 py-1 text-[10px] font-bold tracking-wider">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                {product?.description?.trim() ||
                  "Thoughtfully selected for quality, comfort and everyday style."}
              </p>
            </div>

            {/* Colour Selection */}
            <div className="border-b border-[#e5dfd5] py-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em]">
                  Colour
                </h3>
                <span className="text-xs text-gray-500">
                  {selectedColor || "Select a colour"}
                </span>
              </div>

              {availableColors.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((colour, index) => (
                    <button
                      key={`${colour.name}-${index}`}
                      type="button"
                      title={`${colour.name} — ${colour.quantity} available`}
                      aria-label={colour.name}
                      aria-pressed={selectedColor === colour.name}
                      disabled={hasSizeStock && colour.quantity <= 0}
                      onClick={() => {
                        setSelectedColor(colour.name);
                        setQuantity(1);
                      }}
                      className={`flex h-11 items-center gap-2 rounded-full border px-3 transition ${
                        selectedColor === colour.name
                          ? "border-black bg-white ring-1 ring-black"
                          : "border-[#e1dace] hover:border-gray-500"
                      } ${
                        hasSizeStock && colour.quantity <= 0
                          ? "cursor-not-allowed opacity-40"
                          : ""
                      }`}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-black/10"
                        style={{ backgroundColor: colour.code }}
                      />
                      <span className="text-xs">{colour.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No colours available for this size.
                </p>
              )}
            </div>

            {/* Size Selection */}
            <div className="border-b border-[#e5dfd5] py-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em]">
                  Select Size
                </h3>
                <span className="text-xs text-gray-500">
                  {selectedSize || "No size selected"}
                </span>
              </div>

              {sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const sizeValue = String(size);
                    const sizeEntry = product?.sizeStock?.find(
                      (entry) => String(entry.size) === sizeValue
                    );

                    const sizeQuantity =
                      sizeEntry && Array.isArray(sizeEntry.colourStock)
                        ? sizeEntry.colourStock.reduce(
                            (total, entry) =>
                              total +
                              Math.max(0, Number(entry.quantity) || 0),
                            0
                          )
                        : Math.max(0, Number(product?.stock) || 0);

                    const unavailable =
                      hasSizeStock && sizeQuantity <= 0;

                    return (
                      <button
                        key={sizeValue}
                        type="button"
                        disabled={unavailable}
                        onClick={() => {
                          setSelectedSize(sizeValue);
                          setQuantity(1);
                        }}
                        className={`min-w-12 rounded-lg border px-4 py-3 text-xs font-semibold transition ${
                          selectedSize === sizeValue
                            ? "border-black bg-[#171717] text-white"
                            : "border-[#dfd8cc] bg-white hover:border-black"
                        } ${
                          unavailable
                            ? "cursor-not-allowed opacity-40 line-through"
                            : ""
                        }`}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  This product has no size options.
                </p>
              )}
            </div>

            {/* Selected Variant Stock */}
            {hasSizeStock && selectedSize && selectedColor && (
              <p className="pt-4 text-xs text-gray-500">
                Stock for {selectedSize} / {selectedColor}:{" "}
                <span className="font-semibold text-gray-900">
                  {availableStock}
                </span>
              </p>
            )}

            {/* Quantity */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-6">
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em]">
                  Quantity
                </h3>

                <div className="flex h-11 items-center rounded-lg border border-[#dfd8cc] bg-white">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="h-full w-11 text-lg transition hover:bg-[#eee9e0] disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span className="w-8 text-center text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    disabled={
                      stockToDisplay <= 0 ||
                      quantity >= stockToDisplay
                    }
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(stockToDisplay, prev + 1)
                      )
                    }
                    className="h-full w-11 text-lg transition hover:bg-[#eee9e0] disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`flex items-center justify-end gap-2 text-xs font-semibold ${
                    stockToDisplay <= 0
                      ? "text-red-600"
                      : stockToDisplay <= 10
                        ? "text-amber-700"
                        : "text-emerald-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      stockToDisplay <= 0
                        ? "bg-red-500"
                        : stockToDisplay <= 10
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  {stockToDisplay <= 0
                    ? "Out of Stock"
                    : stockToDisplay <= 10
                      ? `Only ${stockToDisplay} left`
                      : "In Stock"}
                </p>
                <p className="mt-1 text-[10px] text-gray-400">
                  {stockToDisplay > 0
                    ? "Ready for your wardrobe"
                    : "Currently unavailable"}
                </p>
              </div>
            </div>

            {/* Purchase Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCartAction}
                disabled={!canPurchase}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#171717] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#38332c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={17} />
                {cartLoading ? "Adding to Cart..." : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!canPurchase}
                className="w-full rounded-xl border border-[#b39a79] bg-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#73583b] transition hover:bg-[#eee6d9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buyNowLoading ? "Please Wait..." : "Buy Now"}
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-3 divide-x divide-[#e5dfd5] border-y border-[#e5dfd5] py-5">
              <div className="px-2 text-center">
                <ShieldCheck
                  className="mx-auto mb-2"
                  size={21}
                  strokeWidth={1.5}
                />
                <p className="text-[10px] font-medium leading-4 sm:text-xs">
                  Quality Assured
                </p>
              </div>

              <div className="px-2 text-center">
                <Truck
                  className="mx-auto mb-2"
                  size={21}
                  strokeWidth={1.5}
                />
                <p className="text-[10px] font-medium leading-4 sm:text-xs">
                  Free Shipping
                </p>
              </div>

              <div className="px-2 text-center">
                <RefreshCw
                  className="mx-auto mb-2"
                  size={21}
                  strokeWidth={1.5}
                />
                <p className="text-[10px] font-medium leading-4 sm:text-xs">
                  7-Day Returns
                </p>
              </div>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-gray-500">
              <Check size={15} className="text-emerald-700" />
              Secure checkout and quality-focused shopping.
            </p>
          </section>
        </div>

        {/* Product Information Tabs */}
        <section className="mt-16 overflow-hidden rounded-2xl border border-[#e7e0d5] bg-[#fcfaf6] sm:mt-24 sm:rounded-3xl">
          <div className="flex gap-7 overflow-x-auto border-b border-[#e7e0d5] px-5 sm:gap-10 sm:px-9">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "reviews", label: `Reviews (${totalReviews})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === "reviews" && !handleAuthRedirect()) {
                    return;
                  }
                  setActiveTab(tab.id);
                }}
                className={`whitespace-nowrap border-b-2 py-5 text-xs font-bold uppercase tracking-[0.12em] transition ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-9 lg:p-10">
            {/* Description */}
            {activeTab === "description" && (
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a48660]">
                    The Details
                  </p>

                  <h2 className="mb-5 font-serif text-3xl">
                    Made for your everyday.
                  </h2>

                  <p className="whitespace-pre-line text-sm leading-8 text-gray-600">
                    {product?.description?.trim() ||
                      "No description available."}
                  </p>

                  {product?.brand && (
                    <p className="mt-6 text-sm text-gray-500">
                      Brand:{" "}
                      <span className="font-semibold text-gray-900">
                        {product.brand}
                      </span>
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-[#f2eee6] p-6 sm:p-8">
                  <h3 className="mb-6 font-serif text-xl">
                    The shopping experience
                  </h3>

                  {[
                    "Quality-focused product selection",
                    "Comfort and everyday versatility",
                    "Clear product and pricing details",
                    "Customer reviews and feedback",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 border-b border-[#ded6c9] py-4 last:border-0"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm">
                        <Check size={14} />
                      </span>
                      <span className="text-sm text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {activeTab === "specifications" && (
              <div className="max-w-3xl">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a48660]">
                  Product Information
                </p>

                <h2 className="mb-6 font-serif text-3xl">
                  Specifications
                </h2>

                {[
                  ...(product?.brand
                    ? [["Brand", product.brand]]
                    : []),
                  ...(product?.sku
                    ? [["SKU", product.sku]]
                    : []),
                  ...specifications,
                ].length > 0 ? (
                  <div className="divide-y divide-[#e5dfd5]">
                    {[
                      ...(product?.brand
                        ? [["Brand", product.brand]]
                        : []),
                      ...(product?.sku
                        ? [["SKU", product.sku]]
                        : []),
                      ...specifications,
                    ].map(([key, value], index) => (
                      <div
                        key={`${key}-${index}`}
                        className="grid grid-cols-2 gap-4 py-5 text-sm"
                      >
                        <span className="capitalize text-gray-500">
                          {String(key).replace(/([A-Z])/g, " $1")}
                        </span>

                        <span className="break-words text-right font-medium text-gray-900">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No specifications available.
                  </p>
                )}
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a48660]">
                    Real Experiences
                  </p>

                  <h2 className="font-serif text-3xl">
                    Customer Reviews
                  </h2>

                  <div className="mt-6 rounded-2xl bg-[#f2eee6] p-6">
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-6xl">
                        {averageRating.toFixed(1)}
                      </span>

                      <div>
                        <div className="flex gap-1 text-[#c08b37]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={17}
                              fill={
                                star <= Math.round(averageRating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          Based on {totalReviews} reviews
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handleReviewSubmit}
                    className="mt-6 space-y-5 rounded-2xl border border-[#e5dfd5] bg-white p-5 sm:p-6"
                  >
                    <h3 className="font-serif text-xl">
                      Share your experience
                    </h3>

                    <div>
                      <label className="mb-3 block text-xs font-semibold">
                        Your Rating
                      </label>

                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            aria-label={`Rate ${star} out of 5`}
                            aria-pressed={reviewRating === star}
                          >
                            <Star
                              size={25}
                              className={
                                star <= reviewRating
                                  ? "text-[#c08b37]"
                                  : "text-gray-300"
                              }
                              fill={
                                star <= reviewRating
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="product-review"
                        className="mb-2 block text-xs font-semibold"
                      >
                        Your Review
                      </label>

                      <textarea
                        id="product-review"
                        value={reviewDescription}
                        onChange={(e) =>
                          setReviewDescription(e.target.value)
                        }
                        placeholder="Tell us what you think..."
                        rows={4}
                        maxLength={1000}
                        required
                        className="w-full resize-y rounded-xl border border-[#e5dfd5] bg-[#fcfaf6] p-4 text-sm outline-none transition focus:border-black"
                      />

                      <p className="mt-1 text-right text-[10px] text-gray-400">
                        {reviewDescription.length}/1000
                      </p>
                    </div>

                    {reviewError && (
                      <p
                        role="alert"
                        className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                      >
                        {reviewError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full rounded-xl bg-[#171717] px-5 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#38332c] disabled:opacity-50"
                    >
                      {reviewSubmitting
                        ? "Submitting..."
                        : "Submit Review"}
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.15em]">
                    Customer Feedback ({totalReviews})
                  </h3>

                  {reviewsLoading ? (
                    <p className="py-10 text-center text-sm text-gray-500">
                      Loading reviews...
                    </p>
                  ) : reviews.length === 0 ? (
                    <div className="rounded-2xl border border-[#e5dfd5] bg-white p-8 text-center">
                      <Star
                        size={30}
                        className="mx-auto mb-3 text-gray-300"
                      />

                      <p className="font-serif text-xl">
                        No reviews yet
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Be the first to share your experience.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#e5dfd5]">
                      {reviews.map((review, index) => (
                        <article
                          key={review._id || `${review.user}-${index}`}
                          className="py-6 first:pt-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9dfce] font-serif text-lg">
                                {(
                                  review.name ||
                                  review.user?.name ||
                                  "C"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold">
                                  {review.name ||
                                    review.user?.name ||
                                    "Customer"}
                                </h4>

                                <p className="mt-1 text-xs text-gray-400">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt
                                      ).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-0.5 text-[#c08b37]">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={13}
                                  fill={
                                    star <= Number(review.rating)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                            {review.comment ||
                              review.description ||
                              ""}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetailPage;
