import crypto from "crypto";
import mongoose from "mongoose";

import razorpay from "../config/razorpay.js";
import Payment from "../model/paymentModel.js";
import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";
import { Product } from "../model/productModel.js";

// ============================================
// CREATE RAZORPAY ORDER
// ============================================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const payment = await Payment.create({
      user: req.user._id,
      orderId: razorpayOrder.id,
      amount: numericAmount,
      currency: "INR",
      status: "created",
    });

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// ============================================
// VERIFY PAYMENT + REDUCE EXACT VARIANT STOCK
// ============================================
export const verifyPayment = async (req, res) => {
  let session;

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login again",
      });
    }

    // 1. Validate payment details
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are missing",
      });
    }

    // 2. Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error("RAZORPAY_KEY_SECRET is missing");
    }

    const signatureBody =
      `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signatureBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // 3. Find payment belonging to this user
    const paymentRecord = await Payment.findOne({
      orderId: razorpay_order_id,
      user: userId,
    });

    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // 4. Prevent duplicate stock deduction
    const existingOrder = await Order.findOne({
      user: userId,
      razorpayOrderId: razorpay_order_id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        order: existingOrder,
      });
    }

    // 5. Verify payment directly with Razorpay
    const razorpayPayment =
      await razorpay.payments.fetch(razorpay_payment_id);

    if (
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment has not been captured",
      });
    }

    if (
      Number(razorpayPayment.amount) !==
      Math.round(Number(paymentRecord.amount) * 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    // 6. Validate shipping address
    const addressText =
      typeof shippingAddress === "string"
        ? shippingAddress.trim()
        : [
            shippingAddress?.name || shippingAddress?.fullName,
            shippingAddress?.street || shippingAddress?.address,
            shippingAddress?.city,
            shippingAddress?.state,
            shippingAddress?.pincode || shippingAddress?.zipCode,
            shippingAddress?.phone || shippingAddress?.mobile,
          ]
            .filter(Boolean)
            .join(", ");

    if (!addressText) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // 7. Start MongoDB transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Recheck duplicate order inside transaction
    const duplicateOrder = await Order.findOne({
      user: userId,
      razorpayOrderId: razorpay_order_id,
    }).session(session);

    if (duplicateOrder) {
      await session.abortTransaction();

      return res.status(200).json({
        success: true,
        message: "Order already processed",
        order: duplicateOrder,
      });
    }

    // 8. Fetch cart
    const cart = await Cart.findOne({
      user: userId,
    })
      .populate("items.product")
      .session(session);

    if (!cart || !cart.items?.length) {
      throw new Error(
        "Cart is empty. Payment was captured; order recovery may be required."
      );
    }

    // 9. Prepare order items from cart
    const items = [];

    for (const cartItem of cart.items) {
      if (!cartItem.product) {
        throw new Error("A cart product no longer exists");
      }

      const quantity = Number(cartItem.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity in cart");
      }

      const size = String(cartItem.size || "").trim();
      const color = String(
        cartItem.color || cartItem.colour || ""
      ).trim();

      items.push({
        product: cartItem.product._id,
        name: cartItem.product.name,
        image:
          cartItem.product.images?.[0] ||
          cartItem.product.image ||
          "",
        price: Number(cartItem.product.price || 0),
        quantity,
        size,
        color,
        variant: [size, color].filter(Boolean).join(" / "),
      });
    }

    if (!items.length) {
      throw new Error("No valid products found in cart");
    }

    // 10. Calculate total using database prices
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (
      Math.round(totalAmount * 100) !==
      Number(razorpayPayment.amount)
    ) {
      throw new Error(
        "Cart total does not match payment amount. Check the checkout total calculation."
      );
    }

    // 11. Reduce exact size + colour stock
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }

      const quantityToReduce = item.quantity;

      // Products without variant stock
      if (!product.sizeStock || product.sizeStock.length === 0) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: quantityToReduce },
          },
          {
            $inc: { stock: -quantityToReduce },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }

        

        continue;
      }

      // Variant products require size and colour
      if (!item.size || !item.color) {
        throw new Error(
          `Size and colour are required for ${item.name}. Received size="${item.size}", colour="${item.color}".`
        );
      }

      // Find exact size
      const sizeVariant = product.sizeStock.find(
        (variant) =>
          String(variant.size).trim().toLowerCase() ===
          item.size.toLowerCase()
      );

      if (!sizeVariant) {
        throw new Error(
          `Size "${item.size}" not found for ${item.name}`
        );
      }

      // Find exact colour within selected size
      const colourVariant = sizeVariant.colourStock.find(
        (variant) =>
          String(variant.colour).trim().toLowerCase() ===
          item.color.toLowerCase()
      );

      if (!colourVariant) {
        throw new Error(
          `Colour "${item.color}" not found for size "${item.size}" in ${item.name}`
        );
      }


      // Check selected variant stock
      if (colourVariant.quantity < quantityToReduce) {
        throw new Error(
          `Only ${colourVariant.quantity} pieces available for ${item.name}, size ${item.size}, colour ${item.color}`
        );
      }

      // Check overall stock
      if (product.stock < quantityToReduce) {
        throw new Error(
          `Overall stock is insufficient for ${item.name}`
        );
      }

      // Reduce ONLY the selected size and colour
      colourVariant.quantity -= quantityToReduce;

      // Also reduce overall product stock
      product.stock -= quantityToReduce;

      // Save variant and overall stock to MongoDB
      await product.save({ session });

    }

    // 12. Create order
    const [order] = await Order.create(
      [
        {
          user: userId,
          items,
          totalAmount,
          shippingAddress: addressText,
          paymentMethod: "Razorpay",
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          status: "Processing",
          paymentStatus: "Paid",
        },
      ],
      { session }
    );

    // 13. Update payment record
    paymentRecord.paymentId = razorpay_payment_id;
    paymentRecord.status = "success";
    await paymentRecord.save({ session });

    // 14. Clear cart only after stock/order updates
    cart.items = [];
    await cart.save({ session });

    // 15. Commit transaction
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Payment verified, order saved and variant stock updated",
      order,
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("ASLI BACKEND ERROR:", error); // <-- Ye terminal par print karega
    res.status(500).json({ success: false, message: error.message });
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Order processing failed. If payment was captured, contact support before retrying.",
      error: error.message,
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};