import express from "express";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import { cancelMyOrder, getAdminOrders, getMyOrders } from "../controler/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/my-orders", verifyToken, getMyOrders);
orderRouter.get("/admin-orders", verifyToken, isAdmin, getAdminOrders);
orderRouter.post(
    "/:orderId/cancel",
    verifyToken,
    cancelMyOrder
);

export default orderRouter;