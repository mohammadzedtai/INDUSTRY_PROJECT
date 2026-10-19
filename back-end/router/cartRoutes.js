
import express from "express";


import { verifyToken } from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeCartItem, updateCartQuantity } from "../controler/cartController.js";


const cartrouter = express.Router();

cartrouter.get("/", verifyToken, getCart);
cartrouter.post("/add", verifyToken, addToCart);
cartrouter.patch("/:itemId", verifyToken, updateCartQuantity);
cartrouter.delete("/:itemId", verifyToken, removeCartItem);

export default cartrouter;
