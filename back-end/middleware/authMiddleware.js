import jwt from "jsonwebtoken";
import { User } from "../model/authModel.js";

// Verify Token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Token is required"
            });
        }

        const decoded = jwt.verify(token, process.env.JSON_TOKEN);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("JWT ERROR:", error.name, error.message);

        return res.status(401).json({
            status: false,
            message: error.message
        });
    }
};

// Admin Check
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            status: false,
            message: "Access denied. Admin only."
        });
    }
};