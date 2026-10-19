
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addAddress, getAddresses } from "../controler/addressController.js";


const routers = express.Router();

routers.get("/", verifyToken, getAddresses);
routers.post("/", verifyToken, addAddress);

export default routers;
