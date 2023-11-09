import mongoose from "mongoose";

// Define a schema for the product model

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    pictures: {
      type: Array,
      required: true,
    },
  },
  { minimize: false }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
