import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

// Get all products

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Create product

router.post("/", async (req, res) => {
  try {
    // Extract the product information from the request body
    const { name, description, price, stock, category, images: pictures } = req.body;

    // Create a new product with the extracted information
    const product = Product.create({
      name,
      description,
      price,
      stock,
      category,
      pictures,
    });
    const products = await Product.find();
    res.status(201).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update product

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, images: pictures } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      stock,
      category,
      pictures,
    });
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete product

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.isAdmin)
      return res.status(401).json("¡No tienes permiso para hacer esto!");
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get detailed one product

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const similar = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similar });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get products based on the category owned

router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    let products;
    if (category === "all") {
      products = await Product.find().sort({ date: -1 });
    } else {
      products = await Product.find({ category });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// CART ROUTES

// Add a product to the user's cart

router.post("/add-to-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    if (user.cart[productId]) {
      userCart[productId] += 1;
    } else {
      userCart[productId] = 1;
    }
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Remove a product from user cart

router.post("/remove-from-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.count -= userCart[productId];
    userCart.total -= Number(userCart[productId]) * Number(price);
    delete userCart[productId];
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Increase the amount of product in the cart

router.post("/increase-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    userCart[productId] += 1;
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Decrease the amount of product in the cart

router.post("/decrease-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.count -= 1;
    userCart.total = Number(userCart.total) - Number(price);
    userCart[productId] -= 1;
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Increase product stock

router.post("/:id/increase-stock", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
  const product = await Product.findById(id);
  product.stock += amount;
  await product.save();
  res.status(200).json(product);
  } catch (error) {
  res.status(400).send(error.message);
  }
  });
  
  // Decrease product stock
  
  router.post("/:id/decrease-stock", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
  const product = await Product.findById(id);
  if (product.stock < amount) {
  return res.status(400).json("No hay stock.");
  }
  product.stock -= amount;
  await product.save();
  res.status(200).json(product);
  } catch (error) {
  res.status(400).send(error.message);
  }
  });

export default router;
