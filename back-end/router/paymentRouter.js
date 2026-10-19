import express, { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware.js';
import { createOrder, verifyPayment } from '../controler/paymentControler.js';

const paymentRouter = Router();


paymentRouter.post("/create-order", verifyToken, createOrder);
paymentRouter.post("/verify-payment", verifyToken, verifyPayment)

export default paymentRouter