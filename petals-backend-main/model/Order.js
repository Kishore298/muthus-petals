import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      size: { type: String },
      color: { type: String },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    }
  ],
  shippingCharge: {
    type: Number,
    required: true,
    default: 0
  },
  totalprice: {
    type: Number,
    required: true,
    default: 0
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing'
  },
  deliverytimeAT: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OrderModel = mongoose.model("bOrder", orderSchema);

export default OrderModel;
