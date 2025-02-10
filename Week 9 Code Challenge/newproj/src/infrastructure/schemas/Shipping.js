import mongoose from "mongoose";

const ShippingAddressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    addressLine1: { 
        type: String, 
        required: true 
    },
    addressLine2: { 
        type: String 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    postalCode: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
});

const ShippingAddress = mongoose.model("ShippingAddress", ShippingAddressSchema);
export default ShippingAddress;
