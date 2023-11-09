import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file

dotenv.config();

// Configure Cloudinary using environment variables

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const router = express.Router();

// Define a route to delete an image asset in Cloudinary

router.delete("/:public_id", async (req, res) => {
  const { public_id } = req.body;
  console.log(public_id);
  try {
    await cloudinary.uploader.destroy(public_id);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
