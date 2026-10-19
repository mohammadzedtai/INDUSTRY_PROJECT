import express, { Router } from 'express'
import { getAdminCustomers } from '../controler/adminController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const adminRoute = Router();

adminRoute.get(
  "/customers",
  verifyToken,
  isAdmin,
  getAdminCustomers
);

export default adminRoute;