const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    image: {
      type: String,
      required: [true, "Main product image is required"],
    },
    description: {
      type: String,
      default: "",
    },
    section: {
      type: String,
      enum: ["new-arrivals", "best-sellers"],
      required: [true, "Section is required"],
    },
    colors: {
      type: [colorSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one color is required",
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
