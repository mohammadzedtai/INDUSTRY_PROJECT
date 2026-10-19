import { User } from "../model/authModel.js";
import orderModel from "../model/orderModel.js";

// GET ALL REGISTERED CUSTOMERS
export const getAdminCustomers = async (req, res) => {
  try {
    // Fetch only customers, not admin accounts
    const customers = await User.find({ role: "user" })
      .select("name email mobile createdAt")
      .sort({ createdAt: -1 })
      .lean();
      

    // Count orders and calculate spending per customer
    const orderStats = await orderModel.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: "$user",
          orders: { $sum: 1 },
          spent: { $sum: "$totalAmount" },
        },
      },
    ]);

    const statsMap = new Map(
      orderStats.map((item) => [
        String(item._id),
        {
          orders: item.orders,
          spent: item.spent,
        },
      ])
    );

    const customersData = customers.map((customer) => {
      const stats = statsMap.get(String(customer._id)) || {
        orders: 0,
        spent: 0,
      };

      return {
        id: customer._id,
        name: customer.name || "Unknown Customer",
        email: customer.email || "",
        phone: customer.mobile || "",
        orders: stats.orders,
        spent: stats.spent,
        joined: customer.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      totalCustomers: customersData.length,
      customers: customersData,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};