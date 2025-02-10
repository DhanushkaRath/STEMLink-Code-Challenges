import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: { 
        ype: Number, 
        required: true 
    },
});

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
export default OrderItem;
