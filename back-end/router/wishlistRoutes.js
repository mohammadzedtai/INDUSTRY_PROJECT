import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controler/wishlistController.js";

const WishRouter = express.Router();

WishRouter.get("/", verifyToken, getWishlist);
WishRouter.post("/", verifyToken, addToWishlist);
WishRouter.delete("/:productId", verifyToken, removeFromWishlist);

export default WishRouter;
