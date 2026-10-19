import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { DBCONNECT } from './config/db.js';
import authRouter from './router/authRouter.js';
import categoryRouter from './router/categoryRoute.js';
import router from './router/productRoutes.js';
import cartrouter from './router/cartRoutes.js';
import routers from './router/addressRoutes.js';
import paymentRouter from './router/paymentRouter.js';
import orderRouter from './router/orderRoutes.js';
import WishRouter from './router/wishlistRoutes.js';
import adminRoute from './router/adminRoutes.js';
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors(
    "https://e-commerce-rose-phi-68.vercel.app/"
));

app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", router)
app.use("/api/cart", cartrouter);
app.use("/api/address", routers);
app.use("/api/payment", paymentRouter)
app.use("/api/orders", orderRouter)
app.use("/api/wishlist", WishRouter);
app.use("/api/admin", adminRoute)


await DBCONNECT();

app.listen(process.env.PORT, () => {
    console.log(`Server Runnig on ${process.env.PORT}`);
})