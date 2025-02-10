import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderItem",
            required: true,
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "Processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    shippingDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shipping",
        required: true,
    },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;