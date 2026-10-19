import mongoose from "mongoose";
import { User } from "../model/authModel.js";
import { Product } from "../model/productModel.js";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            price,
            old,
            costPrice,
            category,
            description,
            sizeStock,
        } = req.body;

        // 1. Upload images to Cloudinary
        const images = [];

        for (const file of req.files || []) {
            const imageUrl = await uploadImageToCloudinary(file.buffer);
            images.push(imageUrl);
        }

        // 2. Get sizes, colours and total stock
        const stockData = sizeStock ? JSON.parse(sizeStock) : [];

        const sizes = [];
        const colours = new Set();
        let stock = 0;

        stockData.forEach((item) => {
            if (!sizes.includes(item.size)) {
                sizes.push(item.size);
            }

            item.colourStock?.forEach((colour) => {
                colours.add(colour.colour);
                stock += Number(colour.quantity) || 0;
            });
        });

        // 3. Calculate price and discount
        const priceValue = Number(price);
        const originalPrice = Number(old) || priceValue;

        const discount = originalPrice > priceValue
            ? Math.round(
                ((originalPrice - priceValue) / originalPrice) * 100
            )
            : 0;

        // 4. Save product
        const product = await Product.create({
            name,
            brand,
            category,
            images,
            price: priceValue,
            originalPrice,
            costPrice: Number(costPrice) || 0,
            discount,
            description,
            sizes,
            colors: [...colours].map((name) => ({
                name,
                code: name,
            })),
            stock,
            sizeStock: stockData,
        });

        // 5. Send response
        res.status(201).json({
            status: true,
            message: "Product added successfully",
            data: product,
        });

    } catch (error) {
        console.error("Create Product Error:", error.message);

        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

// GET ALL PRODUCTS
export const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate("category", "name");

        res.status(200).json({
            status: true,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        const {
            name,
            brand,
            price,
            old,
            costPrice,
            category,
            description,
            sizeStock
        } = req.body;

        // Update basic details
        if (name !== undefined) product.name = name;
        if (brand !== undefined) product.brand = brand;
        if (category !== undefined) product.category = category;
        if (description !== undefined) product.description = description;

        // Update prices
        if (price !== undefined) product.price = Number(price);

        if (old !== undefined) {
            product.originalPrice = Number(old) || Number(price ?? product.price);
        }

        if (costPrice !== undefined) {
            product.costPrice = Number(costPrice) || 0;
        }

        // Update size and colour stock
        if (sizeStock !== undefined) {
            const stockData = JSON.parse(sizeStock);
            const sizes = [];
            const colours = new Set();
            let totalStock = 0;

            stockData.forEach((item) => {
                if (item.size && !sizes.includes(item.size)) {
                    sizes.push(item.size);
                }

                (item.colourStock || []).forEach((item) => {
                    colours.add(item.colour);
                    totalStock += Number(item.quantity) || 0;
                });
            });

            product.sizeStock = stockData;
            product.sizes = sizes;
            product.colors = [...colours].map((colour) => ({
                name: colour,
                code: colour
            }));
            product.stock = totalStock;
        }

        // Upload new images only if selected
        if (req.files?.length > 0) {
            const images = [];

            for (const file of req.files) {
                const url = await uploadImageToCloudinary(file.buffer);
                images.push(url);
            }

            product.images = images;
        }

        // Recalculate discount
        const sellingPrice = Number(product.price);
        const originalPrice = Number(product.originalPrice);

        product.discount = originalPrice > sellingPrice && originalPrice > 0
            ? Math.round(
                ((originalPrice - sellingPrice) / originalPrice) * 100
            )
            : 0;

        await product.save();

        res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        console.error("Update Product Error:", error.message);

        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// POST /api/product/:id/reviews
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, description, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const numericRating = Number(rating);
    const reviewText = (description ?? comment ?? "").trim();

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!reviewText || reviewText.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review is required (maximum 1000 characters)",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const userId =
      req.user?.userId || req.user?.id || req.user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Please login again",
      });
    }

    const user = await User.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // One review per user per product
    const alreadyReviewed = product.reviews.some(
      (review) => String(review.user) === String(user._id)
    );

    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      user: user._id,
      name: user.name,
      email: user.email,
      rating: numericRating,
      comment: reviewText,
    });

    product.totalReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (total, review) => total + review.rating,
        0
      ) / product.totalReviews;

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: product.reviews[product.reviews.length - 1],
      averageRating: Number(product.rating.toFixed(1)),
      totalReviews: product.totalReviews,
    });
  } catch (error) {
    console.error("Add review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

// GET /api/product/:id/reviews
export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id).select(
      "reviews rating totalReviews"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = [...product.reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      productId: id,
      averageRating: Number(product.rating || 0).toFixed(1),
      totalReviews: product.totalReviews || 0,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};




export const bulkCreateProducts = async (req, res) => {
    try {
        const products = req.body;

        // 1. Validate array
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Please provide a non-empty products array"
            });
        }

        const preparedProducts = [];

        // 2. Validate and prepare each product
        for (let index = 0; index < products.length; index++) {
            const item = products[index];

            if (!item.name || !item.category || item.price === undefined) {
                return res.status(400).json({
                    status: false,
                    message: `Product at index ${index} requires name, category and price`
                });
            }

            if (!mongoose.Types.ObjectId.isValid(item.category)) {
                return res.status(400).json({
                    status: false,
                    message: `Invalid category ID at product index ${index}`
                });
            }

            const price = Number(item.price);
            const originalPrice = Number(
                item.originalPrice ?? item.old ?? item.price
            );
            const costPrice = Number(item.costPrice ?? 0);

            if (
                !Number.isFinite(price) ||
                price < 0 ||
                !Number.isFinite(originalPrice) ||
                originalPrice < 0 ||
                !Number.isFinite(costPrice) ||
                costPrice < 0
            ) {
                return res.status(400).json({
                    status: false,
                    message: `Invalid price at product index ${index}`
                });
            }

            // sizeStock must be an array in bulk JSON
            const stockData = item.sizeStock ?? [];

            if (!Array.isArray(stockData)) {
                return res.status(400).json({
                    status: false,
                    message: `sizeStock must be an array at product index ${index}`
                });
            }

            const sizes = [];
            const colours = new Set();
            let totalStock = 0;

            for (const sizeItem of stockData) {
                if (
                    sizeItem.size &&
                    !sizes.includes(sizeItem.size)
                ) {
                    sizes.push(sizeItem.size);
                }

                for (const colourItem of sizeItem.colourStock ?? []) {
                    const quantity = Number(colourItem.quantity);

                    if (
                        !colourItem.colour ||
                        !Number.isFinite(quantity) ||
                        quantity < 0
                    ) {
                        return res.status(400).json({
                            status: false,
                            message: `Invalid colour or quantity at product index ${index}`
                        });
                    }

                    colours.add(colourItem.colour);
                    totalStock += quantity;
                }
            }

            const discount = originalPrice > price && originalPrice > 0
                ? Math.round(
                    ((originalPrice - price) / originalPrice) * 100
                )
                : 0;

            preparedProducts.push({
                ...item,
                price,
                originalPrice,
                costPrice,
                discount,
                images: item.images ?? [],
                sizes,
                colors: [...colours].map((name) => ({
                    name,
                    code: name
                })),
                stock: totalStock,
                sizeStock: stockData
            });
        }

        // 3. Insert into MongoDB
        const result = await Product.insertMany(preparedProducts);

        return res.status(201).json({
            status: true,
            message: "Products created successfully",
            total: result.length,
            data: result
        });

    } catch (error) {
        console.error("Bulk Create Products Error:", error);

        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
};
