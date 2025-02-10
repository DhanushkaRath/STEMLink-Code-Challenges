import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ["Credit Card", "PayPal", "Cash on Delivery"], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Completed", "Failed"], 
        default: "Pending" 
    },
    transactionId: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
