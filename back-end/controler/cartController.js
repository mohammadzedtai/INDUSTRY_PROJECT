
import mongoose from "mongoose";
import Cart from "../model/cartModel.js";
import { Product } from "../model/productModel.js";

// GET: Logged-in user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
      });
    }

    const items = cart.items
      .filter((item) => item.product)
      .map((item) => ({
        id: item._id,
        productId: item.product._id,
        name: item.product.name,
        image: Array.isArray(item.product.images)
          ? item.product.images[0] || item.product.image || ""
          : item.product.image || "",
        price: Number(item.product.price || 0),
        originalPrice: Number(item.product.originalPrice || 0),
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        stock: Number(item.product.stock || 0),
      }));

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// POST: Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, size = "", color = "" } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // Find or create this user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // Same product, size and color = same cart item
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === String(size) &&
        item.color === String(color)
    );

    if (existingItem) {
      if (existingItem.quantity + qty > stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${stock} items available in stock`,
        });
      }

      existingItem.quantity += qty;
    } else {
      if (qty > stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${stock} items available in stock`,
        });
      }

      cart.items.push({
        product: product._id,
        quantity: qty,
        size: String(size),
        color: String(color),
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// PATCH: Update quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (
      !mongoose.isValidObjectId(itemId) ||
      !Number.isInteger(qty) ||
      qty < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item or quantity",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (qty > Number(product.stock || 0)) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    item.quantity = qty;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// DELETE: Remove a cart item
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item._id.toString() === itemId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items.pull({ _id: itemId });
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
    });
  }
};
