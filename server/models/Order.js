import mongoose from "mongoose";

// Define a schema for the order model
const OrderSchema = mongoose.Schema(
  {
    products: {
      type: Object,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "processing",
    },
    total: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: new Date().toISOString().split("/")[0],
    },
    address: String,
    city: String,
  },
  { minimize: false }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
