import express from "express";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

import {
    addProductReview,
    bulkCreateProducts,
    createProduct,
    deleteProduct,
    getAllProduct,
    getProductReviews,
    getSingleProduct,
    updateProduct
} from "../controler/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", getAllProduct);

// GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);

// CREATE PRODUCT (ADMIN ONLY)
router.post(
    "/create",
    verifyToken,
    isAdmin,
    upload.array("image", 5),
    createProduct
);
// UPDATE PRODUCT (ADMIN ONLY)
router.put(
    "/:id",
    verifyToken,
    isAdmin,
    upload.array("image", 5),
    updateProduct
);

// DELETE PRODUCT (ADMIN ONLY)
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteProduct
);

// ADD REVIEW (LOGIN REQUIRED)
router.post(
    "/:id/reviews",
    verifyToken,
    addProductReview
);
router.post("/bulk", bulkCreateProducts);

// GET PRODUCT REVIEWS
router.get(
    "/:id/reviews",
    getProductReviews
);




export default router;