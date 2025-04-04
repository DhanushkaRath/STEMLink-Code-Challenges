import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  street: { type: String, required: true },
  additionalStreet: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true }
});

export default mongoose.model("Address", AddressSchema);