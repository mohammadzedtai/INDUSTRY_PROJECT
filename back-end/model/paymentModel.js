import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        default: null,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    status: {
        type: String,
        enum: [
            "created",
            "success",
            "failed",
        ],
        default: "created",
    },
}, {timestamps:true})

const Payment = mongoose.model(
    "Payment",
    paymentSchema
)

export default Payment;