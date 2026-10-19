import Order from "../model/orderModel.js";

// Logged-in user ke orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};

// GET ALL ORDERS FOR ADMIN
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const ordersData = orders.map((order) => ({
      id: order._id,
      orderId: `#ORD-${String(order._id).slice(-6).toUpperCase()}`,
      customer: order.user?.name || "Unknown Customer",
      email: order.user?.email || "",
      items: Array.isArray(order.items)
        ? order.items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
          )
        : 0,
      total: order.totalAmount || 0,
      date: order.createdAt,
      status: order.status || "Processing",
      paymentStatus: order.paymentStatus || "Pending",
      paymentMethod: order.paymentMethod || "Razorpay",
      shippingAddress: order.shippingAddress || "",
      products: order.items || [],
      paymentId: order.paymentId || "",
    }));

    return res.status(200).json({
      success: true,
      totalOrders: ordersData.length,
      orders: ordersData,
    });
  } catch (error) {
    console.error("Get admin orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// CANCEL LOGGED-IN USER'S ORDER
export const cancelMyOrder = async (req, res) => {
  try {
    const userId =req.user?._id || req.user?.id || req.user?.userId;

    const { orderId } = req.params;
    const { reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a cancellation reason",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be canceled",
      });
    }

    if (order.status === "Canceled") {
      return res.status(400).json({
        success: false,
        message: "This order is already canceled",
      });
    }

    order.status = "Canceled";
    order.cancellationReason = reason.trim();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel order",
    });
  }
};